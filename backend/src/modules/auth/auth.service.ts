import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { AuthResponseDto } from './dto/response-auth.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { User, UserRole, UserStatus } from '../users/users.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

interface RefreshTokenPayload {
  sub: number;
  type: 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  // ========================================
  // 🔧 MÉTODOS PRIVADOS REUTILIZABLES
  // ========================================

  /**
   * Genera el payload estándar para los tokens JWT
   */
  private createTokenPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Genera un Access Token (corta duración)
   */
  private generateAccessToken(user: User): string {
    const payload = this.createTokenPayload(user);
    const expiresIn: string = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';

    return this.jwtService.sign(
      { ...payload },
      { expiresIn: expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}` },
    );
  }

  /**
   * Genera un Refresh Token (larga duración)
   */
  private generateRefreshToken(user: User): string {
    const payload: RefreshTokenPayload = {
      sub: user.id,
      type: 'refresh',
    };
    const expiresIn: string = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

    return this.jwtService.sign(
      { ...payload },
      { expiresIn: expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}` },
    );
  }

  /**
   * Genera ambos tokens (access + refresh)
   */
  private generateTokens(user: User) {
    return {
      access_token: this.generateAccessToken(user),
      refresh_token: this.generateRefreshToken(user),
    };
  }

  /**
   * Obtiene el tiempo de expiración en segundos
   */
  private getTokenExpirationTime(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';

    // Convertir formato (1h, 15m, 7d) a segundos
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // Default: 1 hora

    const [, value, unit] = match;
    const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };

    return parseInt(value) * (multipliers[unit] || 3600);
  }

  /**
   * Crea la respuesta de autenticación estándar
   */
  private createAuthResponse(
    user: User,
    tokens: { access_token: string; refresh_token: string },
  ): AuthResponseDto {
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: 'Bearer',
      expires_in: this.getTokenExpirationTime(),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ========================================
  // � MÉTODOS DE REFRESH TOKEN
  // ========================================

  /**
   * Guarda un refresh token en la base de datos
   */
  private async saveRefreshToken(
    userId: number,
    token: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<RefreshToken> {
    // Hashear el token antes de guardarlo
    const hashedToken = await bcrypt.hash(token, 10);

    // Calcular fecha de expiración
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const expiresAt = this.calculateExpirationDate(expiresIn);

    // Crear y guardar el refresh token
    const refreshToken = this.refreshTokenRepository.create({
      token: hashedToken,
      userId,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }

  /**
   * Busca un refresh token válido en la BD
   */
  private async findRefreshToken(token: string, userId: number): Promise<RefreshToken | null> {
    // Buscar todos los tokens activos del usuario
    const tokens = await this.refreshTokenRepository.find({
      where: {
        userId,
        isRevoked: false,
      },
    });

    // Comparar el token con los hasheados
    for (const tokenRecord of tokens) {
      const isMatch = await bcrypt.compare(token, tokenRecord.token);
      if (isMatch) {
        return tokenRecord;
      }
    }

    return null;
  }

  /**
   * Revoca un refresh token específico
   */
  private async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.update(tokenId, {
      isRevoked: true,
      updatedAt: new Date(),
    });
  }

  /**
   * Revoca todos los refresh tokens de un usuario
   */
  private async revokeAllUserTokens(userId: number): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true, updatedAt: new Date() },
    );
  }

  /**
   * Calcula la fecha de expiración basada en el formato (1h, 7d, etc.)
   */
  private calculateExpirationDate(expiresIn: string): Date {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      // Default: 7 días
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const [, value, unit] = match;
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + parseInt(value) * (multipliers[unit] || 86400000));
  }

  // ========================================
  // �📍 MÉTODOS PÚBLICOS
  // ========================================

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.FindByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async login(
    loginDto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    // Validar credenciales
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // ✅ Generar tokens
    const tokens = this.generateTokens(user);

    // ✅ Guardar refresh token en BD
    await this.saveRefreshToken(user.id, tokens.refresh_token, ipAddress, userAgent);

    // ✅ Crear respuesta
    return this.createAuthResponse(user, tokens);
  }

  async register(
    registerDto: RegisterDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    // Verificar si el email ya existe
    const existingUser = await this.usersService.FindByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email is already in use');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const newUser = await this.usersService.CreateUser({
      ...registerDto,
      password: hashedPassword,
      role: UserRole.CUSTOMER, // Asignar rol por defecto
    });

    // ✅ Generar tokens
    const tokens = this.generateTokens(newUser);

    // ✅ Guardar refresh token en BD
    await this.saveRefreshToken(newUser.id, tokens.refresh_token, ipAddress, userAgent);

    // ✅ Crear respuesta
    return this.createAuthResponse(newUser, tokens);
  }

  async validateToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);
      const user = await this.usersService.FindById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(userId: number): Promise<void> {
    // Revocar todos los refresh tokens del usuario
    await this.revokeAllUserTokens(userId);
  }

  /**
   * Refresca el access token usando un refresh token válido
   */
  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // 1. Verificar y decodificar el refresh token
      const payload = this.jwtService.verify<RefreshTokenPayload>(refreshToken);

      // 2. Validar que sea un refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      // 3. Buscar el usuario
      const user = await this.usersService.FindById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // 4. Verificar que el usuario esté activo
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      // 5. ✅ Buscar token en BD y verificar que no esté revocado
      const tokenRecord = await this.findRefreshToken(refreshToken, user.id);
      if (!tokenRecord) {
        throw new UnauthorizedException('Refresh token inválido o revocado');
      }

      // 6. ✅ Verificar que no haya expirado
      if (tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expirado');
      }

      // 7. ✅ Token Rotation: Revocar el token anterior
      await this.revokeRefreshToken(tokenRecord.id);

      // 8. ✅ Generar nuevos tokens
      const tokens = this.generateTokens(user);

      // 9. ✅ Guardar el nuevo refresh token en BD
      await this.saveRefreshToken(
        user.id,
        tokens.refresh_token,
        tokenRecord.ipAddress,
        tokenRecord.userAgent,
      );

      // 10. Retornar respuesta
      return this.createAuthResponse(user, tokens);
    } catch (error) {
      // Manejar errores de JWT (expirado, inválido, etc.)
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Refresh token expirado');
        }
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Refresh token inválido');
        }
      }

      // Re-lanzar otros errores
      throw error;
    }
  }

  /**
   * Verifica si ya existe al menos un usuario con rol admin
   * Útil para el setup inicial del sistema
   */
  async checkIfAdminExists(): Promise<boolean> {
    const adminUsers = await this.usersService.findByRole(UserRole.ADMIN);
    return adminUsers && adminUsers.length > 0;
  }
}

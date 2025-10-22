import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login-auth.dto";
import { RegisterDto } from "./dto/register-auth.dto";
import { AuthResponseDto } from "./dto/response-auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    // ========================================
    // 🔧 MÉTODOS PRIVADOS REUTILIZABLES
    // ========================================

    /**
     * Genera el payload estándar para los tokens JWT
     */
    private createTokenPayload(user: any) {
        return {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
    }

    /**
     * Genera un Access Token (corta duración)
     */
    private generateAccessToken(user: any): string {
        const payload = this.createTokenPayload(user);
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
        
        return this.jwtService.sign(payload, { expiresIn });
    }

    /**
     * Genera un Refresh Token (larga duración)
     */
    private generateRefreshToken(user: any): string {
        const payload = {
            sub: user.id,
            type: 'refresh', // Identificar que es un refresh token
        };
        const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
        
        return this.jwtService.sign(payload, { expiresIn });
    }

    /**
     * Genera ambos tokens (access + refresh)
     */
    private generateTokens(user: any) {
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
        const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
        
        return parseInt(value) * multipliers[unit];
    }

    /**
     * Crea la respuesta de autenticación estándar
     */
    private createAuthResponse(user: any, tokens: { access_token: string; refresh_token: string }): AuthResponseDto {
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
    // 📍 MÉTODOS PÚBLICOS
    // ========================================

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.FindByEmail(email);
        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return user;
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        // Validar credenciales
        const user = await this.validateUser(loginDto.email, loginDto.password);
        
        // ✅ Usar método unificado para generar tokens
        const tokens = this.generateTokens(user);
        
        // ✅ Usar método unificado para crear respuesta
        return this.createAuthResponse(user, tokens);
    }


    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
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
            role: registerDto.role ?? "user",
        });

        // ✅ Usar método unificado para generar tokens
        const tokens = this.generateTokens(newUser);
        
        // ✅ Usar método unificado para crear respuesta
        return this.createAuthResponse(newUser, tokens);
    }


    async validateToken(token: string): Promise<any> {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.usersService.FindById(decoded.sub);
            if (!user) {
                throw new UnauthorizedException("Invalid token");
            }
            return user;
        } catch (e) {
            throw new UnauthorizedException("Invalid token");
        }
    }


    async logout(userId: string): Promise<void> {
        // Implement token invalidation logic if using a token blacklist or similar strategy



        return;
    }

    
    async refreshToken(userId: string): Promise<AuthResponseDto> {
        // Buscar usuario
        const user = await this.usersService.FindById(Number(userId));
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        
        // ✅ Usar método unificado para generar tokens
        const tokens = this.generateTokens(user);
        
        // ✅ Usar método unificado para crear respuesta
        return this.createAuthResponse(user, tokens);
    }   
}
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Repository } from "typeorm";
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
    ) {}

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
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const payload = { username: user.username, sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            token_type: "Bearer",
            expires_in: 3600, // or set this value according to your JWT expiration config
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        };
    }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = await this.usersService.CreateUser({
            ...registerDto,
            password: hashedPassword,
            role: registerDto.role ?? "user", // Provide a default role if undefined
        });
        const payload = { username: newUser.username, sub: newUser.id, role: newUser.role };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            token_type: "Bearer",
            expires_in: 3600, // or set this value according to your JWT expiration config
            user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
        };
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
        const user = await this.usersService.FindById(Number(userId));
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        const payload = { username: user.username, sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            token_type: "Bearer",
            expires_in: 3600, // or set this value according to your JWT expiration config
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        };
    }   
}
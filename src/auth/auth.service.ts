import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { LoginResponse } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> | null {
    const user = await this.usersService.findByEmail(email);
    const passwordIsValid = user.password === pass;
    if (passwordIsValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email } = user;
      return { email };
    }
    return null;
  }

  async verify(token: string): Promise<User> {
    const decoded: JwtPayload = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const userEmail = decoded.sub;
    const user = await this.usersService.findByEmail(userEmail);
    return user;
  }

  async login(user: User): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.email,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}

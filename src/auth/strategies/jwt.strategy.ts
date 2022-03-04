import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from 'src/config/auth.config';
import { User } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<AuthConfig>('auth').jwt.secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const userLogged = await this.usersService.findById(payload.sub);
    if (!userLogged) {
      throw new InternalServerErrorException(
        'An error has ocurred. Could not get user owner of the access token.',
      );
    }
    return userLogged;
  }
}

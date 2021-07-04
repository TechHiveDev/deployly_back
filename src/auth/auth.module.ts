import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { Config } from "../core/config";
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entity/user.entity";
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from "../users/users.module";
import { JwtStrategy } from "./JwtStrategy";
@Module({
    imports: [
      UsersModule,
      TypeOrmModule.forFeature([User]),
      JwtModule.register({
          secret: Config.jwt.secret,
          signOptions: { expiresIn: Config.jwt.expires_in },
      }),
      PassportModule,
    ],
    providers: [AuthService,JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entity/user.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { LoginDTO } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    protected readonly usersService : UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDTO) {
    const user = await this.validateUser(dto.email,dto.password);
    if (!user) {
      throw new HttpException({
        statusCode:400,
        message: 'Invalid Credentials'
      },HttpStatus.CONFLICT);
    }
    const token = await this.sign(user);
    return { user: user, access_token: token };
  }
  async validateUser(email, password) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return false
    }
    const check = await bcrypt.compareSync(password,user.password);
    if (check) {
      return user;
    }
    return false;
  }


  // sign user and generate token
  async sign(user: User) {
    const payload = { username: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  // get user info
  async me(user: any) {
    return await this.usersService.findByEmail(user.email)
  }

}

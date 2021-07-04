import { Injectable } from '@nestjs/common';
import { Command, Positional } from "nestjs-command";
import { UsersService } from "../users/users.service";
import { CreateUserDTO } from "../users/dto/createUser.dto";
import * as bcrypt from 'bcrypt'


@Injectable()
export class AppService {

  constructor(
    private readonly usersService: UsersService
  ) {
  }

  @Command({command:'new:user <name> <email> <password> '})
  async createUser(
    @Positional({ name: 'name', type: 'string' }) name: string,
    @Positional({ name: 'email', type: 'string' }) email: string,
    @Positional({ name: 'password', type: 'string' }) password: string,
  ) {
    try {
      const user = new CreateUserDTO();
      user.name = name;
      user.email = email;
      user.password = password
      user.isAdmin = 1;
      await this.usersService.createUser(user);
      console.log('User Created');
      return true;
    } catch (e) {
      console.log(e);
    }
  }

}

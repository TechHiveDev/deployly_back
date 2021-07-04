import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "../users.service";
import { JwtAuthGuard } from "../../auth/guards/jwt.guard";
import { AdminGuard } from "../../auth/guards/admin.guard";
import { User } from "../entity/user.entity";
import { CreateUserDTO } from "../dto/createUser.dto";

// @ts-ignore
// @ts-ignore
@Controller('users')
@UseGuards(JwtAuthGuard,AdminGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  async getUsers() : Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Post()
  async createUser(@Body() dto: CreateUserDTO) {
    return await this.usersService.createUser(dto);
  }
}

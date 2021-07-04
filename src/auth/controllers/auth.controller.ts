import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { LoginDTO } from "../dto/login.dto";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { JwtAuthGuard } from "../guards/jwt.guard";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@Req() req: Request) {
    return await  this.authService.me(req.user);
  }

  @Post('login')
  async login(@Body() dto:LoginDTO) {
    return await this.authService.login(dto);
  }
}

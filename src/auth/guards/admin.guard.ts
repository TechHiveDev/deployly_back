import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from "../../users/users.service";
import { Request } from "express";

@Injectable()
export class AdminGuard implements CanActivate {


  constructor(
    private readonly usersService: UsersService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.validateRequest(context);
  }

  async validateRequest(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    return this.usersService.isAdmin(request.user);
  }
}
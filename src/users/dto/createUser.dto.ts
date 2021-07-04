import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDTO {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  password: string

  gitUsername?: string

  @IsEmail()
  email: string

  isAdmin?: number
}
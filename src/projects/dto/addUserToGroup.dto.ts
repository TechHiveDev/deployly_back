import { IsNotEmpty } from "class-validator";

export  class AddUserToGroupDto {
  @IsNotEmpty()
  user_id: number

  @IsNotEmpty()
  group_id: number
}
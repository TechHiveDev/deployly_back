import { IsNotEmpty } from "class-validator";

export class ProjectGroupCreateDto {
  @IsNotEmpty()
  name: string
}
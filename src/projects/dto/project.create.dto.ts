import { IsNotEmpty, IsUrl } from "class-validator";

export class ProjectCreateDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsUrl()
  repoUrl: string

  @IsNotEmpty()
  path: string

  @IsNotEmpty()
  branch: string

  @IsNotEmpty()
  group: number

}
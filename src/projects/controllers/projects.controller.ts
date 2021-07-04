import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt.guard";
import { ProjectsService } from "../services/projects.service";
import { Project } from "../entity/project.entity";
import { ProjectCreateDto } from "../dto/project.create.dto";
import { AdminGuard } from "../../auth/guards/admin.guard";

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService : ProjectsService
  ) {}

  @UseGuards(AdminGuard)
  @Post()
  async createProject(@Body() dto: ProjectCreateDto) {
    return await this.projectsService.createProject(dto);
  }

  @UseGuards(AdminGuard)
  @Delete(":id")
  async deleteProject(@Param() params) {
    return await this.projectsService.deleteProject(params.id);
  }

}

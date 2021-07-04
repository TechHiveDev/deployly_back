import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt.guard";
import { ProjectGroupCreateDto } from "../dto/projectGroup.create.dto";
import { ProjectGroupsService } from "../services/projectGroups.service";
import { ProjectGroup } from "../entity/projectGroup.entity";
import { AddUserToGroupDto } from "../dto/addUserToGroup.dto";
import { AdminGuard } from "../../auth/guards/admin.guard";

@Controller("projectGroups")
@UseGuards(JwtAuthGuard)
export class ProjectGroupsController {

  constructor(
    private readonly projectGroupsService: ProjectGroupsService
  ) {
  }

  @Get()
  async getGroups(@Request() req): Promise<ProjectGroup[]> {
    return await this.projectGroupsService.getGroups(req.user);
  }

  @Get(":id")
  async getGroup(@Request() req,@Param() params): Promise<ProjectGroup> {
    return await this.projectGroupsService.getGroup(req.user,params.id);
  }


  @UseGuards(AdminGuard)
  @Post()
  async store(@Body() dto: ProjectGroupCreateDto) {
    return await this.projectGroupsService.createGroup(dto);
  }

  @UseGuards(AdminGuard)
  @Post("/assignUser")
  async addUser(@Body() dto: AddUserToGroupDto) {
    return await this.projectGroupsService.addUserToGroup(dto.user_id,dto.group_id);
  }

  @UseGuards(AdminGuard)
  @Delete("removeUser")
  async deleteUserFromGroup(@Body() dto: AddUserToGroupDto) {
    return await  this.projectGroupsService.removeUserFromGroup(dto.user_id,dto.group_id);
  }

  @UseGuards(AdminGuard)
  @Delete(":id")
  async deleteGroup(@Param() q){
    return await this.projectGroupsService.deleteGroup(q.id);
  }


}

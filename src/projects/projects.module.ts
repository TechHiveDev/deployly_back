import { Module } from '@nestjs/common';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./entity/project.entity";
import { ProjectGroup } from "./entity/projectGroup.entity";
import { UsersModule } from "../users/users.module";
import { ProjectGroupsService } from "./services/projectGroups.service";
import { ProjectGroupsController } from "./controllers/projectGroups.controller";
import { GithubModule } from "../github/github.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Project,ProjectGroup]),
    UsersModule,
    GithubModule
  ],
  providers: [ProjectsService,ProjectGroupsService],
  controllers: [ProjectsController,ProjectGroupsController]
})
export class ProjectsModule {}

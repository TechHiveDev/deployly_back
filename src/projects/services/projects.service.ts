import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../entity/project.entity";
import { getConnection, Repository } from "typeorm";
import { ProjectGroup } from "../entity/projectGroup.entity";
import { ProjectCreateDto } from "../dto/project.create.dto";
import * as fs from 'fs'
import * as path from "path";
import { GithubService } from "../../github/github.service";


@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(ProjectGroup)
    private readonly projectGroupsRepo: Repository<ProjectGroup>,
    private readonly githubService: GithubService
  ) {}

  async getAll() {
    return await this.projectsRepo.find();
  }


  async createProject(dto: ProjectCreateDto) {
    // init transaction
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // check if the group in the request is already exist
    const group = await this.projectGroupsRepo.findOneOrFail(dto.group);
    const checkDir = this.checkForProjectPath(dto.path)
    await this.githubService.getRepoInfo(dto.repoUrl);
    if (!checkDir) {
      throw new BadRequestException({
        message: "There's no Git repo found at this path,  Please make sure you cloned the repo on this path"
      })
    }
    try {
      // start transaction
      await queryRunner.startTransaction();

      const project = new Project();
      project.group = group;
      project.branch = dto.branch;
      project.path = dto.path
      project.repoUrl = dto.repoUrl
      project.name = dto.name
      const newProject = await queryRunner.manager.save(project);
      const webHookURL = await this.githubService.createWebhook(dto.repoUrl,newProject.id);
      console.log(webHookURL);
      await queryRunner.commitTransaction();
      return { ...newProject,webHookUrl: webHookURL };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        message: "Unable To Save The Project",
        data: {
          error: e.message
        }
      })
    }

  }

  async deleteProject(id: number) {
    return await this.projectsRepo.delete(id)
  }

  checkForProjectPath(pathStr: string) {
    let _path =  path.resolve(pathStr);
    _path = path.join(_path,'.git')
    return fs.existsSync(_path);
  }

}

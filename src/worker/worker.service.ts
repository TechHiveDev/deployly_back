import { Injectable } from "@nestjs/common";
import { spawn } from "child_process";
import { InjectRepository } from "@nestjs/typeorm";
import { Project, ProjectUpdateStatus } from "../projects/entity/project.entity";
import { Repository } from "typeorm";

@Injectable()
export class WorkerService {

  constructor(
    @InjectRepository(Project)
    private readonly  projectsRepo: Repository<Project>
  ) {}

  async triggerWorker(req, id) {
    const project = await this.projectsRepo.findOne(id);
    const job = spawn('bash auto_deploy.sh', {
      cwd: project.path,
      shell: '/bin/bash',
      detached: true
    })
    project.lastUpdateStatus = ProjectUpdateStatus.working
    await this.projectsRepo.save(project);

    job.stdout.on('data',(data) => {
      console.info(data.toString());
    })

    job.stderr.on('data',(data) => {
      project.lastUpdateStatus = ProjectUpdateStatus.failed
      this.projectsRepo.save(project);
      console.log('waaaaaaaaaa');
      console.error(data.toString());
    })

    job.on('error',(e) => {
      console.log('error');
    })

    job.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    return {
      message: "Start Working"
    }
  }
}

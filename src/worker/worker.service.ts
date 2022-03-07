import { Injectable } from "@nestjs/common";
import { spawn } from "child_process";
import { InjectRepository } from "@nestjs/typeorm";
import { Project, ProjectUpdateStatus } from "../projects/entity/project.entity";
import { Repository } from "typeorm";
import { WorkerGateway } from "./worker.gate";

@Injectable()
export class WorkerService {

  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    private readonly workerGateway: WorkerGateway
  ) {}

  async triggerWorker(req, id) {
    const project = await this.projectsRepo.findOne(id);
    const job = spawn('bash auto_deploy.sh', {
      cwd: project.path,
      shell: '/bin/bash',
      detached: true
    })
    const eventId = `project_${project.id}`
    project.lastUpdateStatus = ProjectUpdateStatus.working
    await this.projectsRepo.save(project);

    job.stdout.on('data',(data) => {
      console.log(data.toString());
      this.workerGateway.server.emit(eventId,{
        output: data.toString(),
        status: ProjectUpdateStatus.working
      });
    })

    job.on('error',(e) => {
      console.log(e)
      console.log('error');
    })

    job.on('close', (code,d) => {
      let status
      console.log(d)
      if (code === 0) {
        status = ProjectUpdateStatus.success
        project.lastUpdateStatus = ProjectUpdateStatus.success
      } else {
        status = ProjectUpdateStatus.failed
        project.lastUpdateStatus = ProjectUpdateStatus.failed
      }
      this.projectsRepo.save(project);
      this.workerGateway.server.emit(eventId,{
        output: "AutoDeploy Finished",
        status: status
      });
    });

    return {
      message: "Start Working"
    }
  }
}

import { Body, Controller, Param, Post } from "@nestjs/common";
import { WorkerService } from "./worker.service";

@Controller('worker')
export class WorkerController {
  constructor(
    private readonly workerService: WorkerService
  ) {}

  @Post('trigger/:id')
  async runJobOnRepo(@Body() req,@Param() params) {
    return this.workerService.triggerWorker(req,params.id);
  }

}

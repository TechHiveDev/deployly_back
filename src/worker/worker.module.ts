import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "../projects/entity/project.entity";
import { WorkerGateway } from "./worker.gate";

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
  ],
  providers: [WorkerService,WorkerGateway],
  controllers: [WorkerController]
})
export class WorkerModule {}

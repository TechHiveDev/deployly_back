import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "../projects/entity/project.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
  ],
  providers: [WorkerService],
  controllers: [WorkerController]
})
export class WorkerModule {}

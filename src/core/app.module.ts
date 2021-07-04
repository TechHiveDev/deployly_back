import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Config } from "./config";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { CommandModule } from "nestjs-command";
import { ProjectsModule } from "../projects/projects.module";
import { GithubModule } from "../github/github.module";
import { WorkerModule } from "../worker/worker.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: Config.db.type,
      username: Config.db.username,
      database: Config.db.name,
      password: Config.db.password,
      synchronize: Config.db.synchronize,
      autoLoadEntities: Config.db.autoLoadEntities
    }),
    UsersModule,
    AuthModule,
    CommandModule,
    GithubModule,
    ProjectsModule,
    WorkerModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

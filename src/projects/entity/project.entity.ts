import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ProjectGroup } from "./projectGroup.entity";

export enum ProjectUpdateStatus {
  failed = 'failed',
  success = 'success',
  working = 'working',
}

@Entity({name: 'projects'})
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: false
  })
  name: string

  @Column({
    unique: true
  })
  repoUrl: string

  @Column({
    unique: true
  })
  path: string

  @Column({
    default: 'develop'
  })
  branch: string

  @Column({
    type:"enum",
    enum: ProjectUpdateStatus,
    default: null,
    nullable: true
  })
  lastUpdateStatus: ProjectUpdateStatus

  @Column({
    nullable: true
  })
  lastCommit: string

  @Column({
    nullable: true
  })
  lastUpdate: Date



  @ManyToOne(()=>ProjectGroup, group => group.projects,{
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  })
  group: ProjectGroup

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

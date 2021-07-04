import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Project } from "./project.entity";
import { User } from "../../users/entity/user.entity";

@Entity({
  name: 'project_groups'
})
export class ProjectGroup {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true
  })
  name: string

  @OneToMany(() => Project, project => project.group,{
    eager: true,
    cascade: true,
  })
  projects: Project[]

  @ManyToMany(() => User, user => user.groups,{
    cascade: true,
  })
  @JoinTable()
  users: User[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
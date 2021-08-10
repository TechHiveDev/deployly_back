import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
  UpdateDateColumn
} from "typeorm";
import { ProjectGroup } from "../../projects/entity/projectGroup.entity";

@Entity({ name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  email: string;

  @Column({
    nullable: true
  })
  password: string;

  @Column({
    nullable: true
  })
  gitUsername: string;

  @CreateDateColumn()
  lastLogin: Date

  @Column({
    default: 0,
  })
  isAdmin: number;

  @ManyToMany(()=> ProjectGroup, group => group.users,{
    eager: true,
  })
  groups: ProjectGroup[]


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

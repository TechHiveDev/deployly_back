import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectGroup } from "../entity/projectGroup.entity";
import { getConnection, In, Repository } from "typeorm";
import { ProjectGroupCreateDto } from "../dto/projectGroup.create.dto";
import { UsersService } from "../../users/users.service";
import { User } from "../../users/entity/user.entity";

@Injectable()
export class ProjectGroupsService {
  constructor(
    @InjectRepository(ProjectGroup)
    private readonly projectGroupsRepo: Repository<ProjectGroup>,
    private readonly usersService : UsersService
  ) {}


  async getGroups(_user: any) {
    const isAdmin = await this.usersService.isAdmin(_user);
    if (isAdmin) {
      return await this.projectGroupsRepo.find({
        relations:['users']
      });
    } else {
      const q = await getConnection().createQueryRunner()
        .query(`SELECT groups.id FROM project_groups groups 
                      INNER JOIN project_groups_users_users ag ON groups.id = ag.projectGroupsId 
                      WHERE ag.usersId = ${_user.id}`);
      const hq = q.map(h=>{
        return h.id
      })
      return await this.projectGroupsRepo.find({
        where: {
          id: In(hq)
        },
        relations: ['users']
      });
    }
  }

  async createGroup(dto: ProjectGroupCreateDto) {
    try {
      return await this.projectGroupsRepo.save(dto);
    } catch (e) {
      throw new InternalServerErrorException({
        message: "Unable To Save The Project",
        data: {
          error: e.message
        }
      })
    }
  }

  async deleteGroup(id: number) {
    return await this.projectGroupsRepo.delete(id);
  }

  async addUserToGroup(user_id: number, group_id: number) {
    const user = await this.usersService.findById(user_id);
    // check for the validity of the user id
    if (!user)
      throw new BadRequestException({
        message: "Invalid User Id"
      })
    const group = await this.projectGroupsRepo.findOne({
      where:{
        id:group_id
      },
      relations:['users']
    });

    // check for the validity of the group id
    if (!group)
      throw new BadRequestException({
        message: "Invalid Group Id"
      })
    let users: User[] = group.users;

    // check if this user is already added
    if (group.users.find(g => g.id === user.id)){
      throw new BadRequestException({
        message: "User already added"
      })
    }
    // push the user and save
    users.push(user)
    group.users = users
    return await  this.projectGroupsRepo.save(group);
  }

  async removeUserFromGroup(user_id,group_id) {
    const user = await this.usersService.findById(user_id);
    // check for the validity of the user id
    if (!user)
      throw new BadRequestException({
        message: "Invalid User Id"
      })
    const group = await this.projectGroupsRepo.findOne({
      where:{
        id:group_id
      },
      relations:['users']
    });

    // check for the validity of the group id
    if (!group)
      throw new BadRequestException({
        message: "Invalid Group Id"
      })

    // check if this user is already added
    if (!group.users.find(g => g.id !== user.id)){
      throw new BadRequestException({
        message: "User not found in this group"
      })
    }

    // remove user from users list
    group.users = group.users.filter(user => user.id !== user_id)
    return await  this.projectGroupsRepo.save(group);

  }

  async getGroup(user, id) {
    const isAdmin = await this.usersService.isAdmin(user);
    const group = await this.projectGroupsRepo.findOneOrFail(id,{
      relations: ['users']
    });
    if (!isAdmin && !group.users.find(user => user.id === user.id)) {
      throw new ForbiddenException({
        message:" Forbidden Reoources Requested"
      })
    }
    return group;
  }
}

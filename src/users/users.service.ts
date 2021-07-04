import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/createUser.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>
  ) {
  }

  // create User
  async createUser(user: CreateUserDTO) {
    user.password = bcrypt.hashSync(user.password,bcrypt.genSaltSync(10));
    return await this.usersRepo.save(user);
  }

  // update user
  async updateUser(id: number,user) {
    return await this.usersRepo.update(id,user);
  }

  // delete user
  async deleteUser(id) {
    return await this.usersRepo.delete(id);
  }

  // find by email
  async findByEmail(email) {
    return await this.usersRepo.findOne({
      where:{
        email:email
      }
    });
  }

  // findById
  async findById(id:number): Promise<User> {
    return await this.usersRepo.findOne(id);
  }

  // is Admin
  async isAdmin(obj: any) {
    const user = await this.usersRepo.findOne(obj.id);
    return !!user.isAdmin;
  }

  async getGroups(obj: any) {
    const user = await this.usersRepo.findOneOrFail(obj.id,{
      relations: ['groups']
    });
    return user.groups;
  }

  async getAllUsers() {
    return await this.usersRepo.find();
  }
}

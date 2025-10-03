import DbContext from "@/infrastructure/database/sequelize";
import IUserRepository from "@/application/interfaces/repositories/user";
import User from "@/domain/models/user";
import IBaseMapper from "@/application/interfaces/base/base-mapper";
import UserEntity from "@/infrastructure/database/entities/user";

export default class UserRepository implements IUserRepository {
  constructor(readonly mapper: IBaseMapper<User, Partial<UserEntity>>) {}

  async getOneById(userId: number): Promise<User | null> {
    const user = await DbContext.Users.findOne({ where: { id: userId } });
    return user as User | null;
  }

  async getOneByEmail(email: string): Promise<User | null> {
    const user = await DbContext.Users.findOne({ where: { email } });
    // get sequelize user textplain
    const userPlain = user?.get({ plain: true });
    return userPlain as User | null;
  }

  async getAll(): Promise<User[] | null> {
    const users = await DbContext.Users.findAll({ where: { isActive: true } });
    return users as User[] | null;
  }

  async createOne(user: User): Promise<User> {
    const newUser = this.mapper.map(user);
    const result = await DbContext.Users.create(newUser);
    return result as User;
  }

  async updateOne(user: User): Promise<User | null> {
    const updatedUser = this.mapper.map(user);
    const [affectedCount] = await DbContext.Users.update(updatedUser, {
      where: { id: updatedUser.id },
    });
    return affectedCount > 0 ? user : null;
  }

  async deleteOneById(id: number): Promise<boolean> {
    const user = await DbContext.Users.destroy({ where: { id } });
    if (user > 0) {
      return true;
    }
    return false;
  }

  async deleteOneByEmail(email: string): Promise<boolean> {
    const user = await DbContext.Users.destroy({ where: { email } });
    if (user > 0) {
      return true;
    }
    return false;
  }
}

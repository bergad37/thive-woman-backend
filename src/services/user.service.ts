import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { AppError } from "../utils/app-error";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(payload: Partial<User>) {
    const existingUser = await this.userRepository.findOneBy({ email: payload.email });

    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const user = this.userRepository.create({
      ...payload,
      password: payload.password ? await bcrypt.hash(payload.password, 10) : undefined
    });
    return this.userRepository.save(user);
  }

  async getUsers() {
    return this.userRepository.find({
      order: { createdAt: "DESC" }
    });
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async updateUser(id: string, payload: Partial<User>) {
    const user = await this.getUserById(id);
    Object.assign(user, payload);

    if (payload.password) {
      user.password = await bcrypt.hash(payload.password, 10);
    }

    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
    return { message: "User deleted successfully" };
  }
}

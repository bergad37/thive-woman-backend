import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { AppError } from "../utils/app-error";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(payload: Partial<User>) {
    const existingUser = await this.userRepository.findOneBy({ email: payload.email });

    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await bcrypt.hash(payload.password || "", 10);

    const user = this.userRepository.create({
      ...payload,
      password: hashedPassword
    });

    return this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    return user;
  }
}

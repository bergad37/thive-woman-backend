import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../entities/user.entity";

export const generateToken = (user: User) => {
  const secret = process.env.JWT_SECRET || "super-secret-key";
  const expiresIn = (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    secret,
    {
      expiresIn
    }
  );
};

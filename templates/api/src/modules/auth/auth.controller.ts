import bcrypt from "bcryptjs";
import { AppDataSource } from "../../data-source";
import { User } from "../user/user.entity";
import { signToken } from "../../utils/jwt";
import { ConflictError } from "../../errors/ConflictError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../types/api";
import { registerSchema, loginSchema } from "./auth.schemas";

export const register = asyncHandler(async (req, res) => {
  const { email, password } = registerSchema.parse(req.body);
  const userRepo = AppDataSource.getRepository(User);

  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    throw new ConflictError("Email already registered");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = userRepo.create({ email, password: hashed });
  await userRepo.save(user);

  const token = signToken({ userId: user.id });
  const body: ApiResponse<{ token: string }> = { data: { token } };
  res.status(201).json(body);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = signToken({ userId: user.id });
  const body: ApiResponse<{ token: string }> = { data: { token } };
  res.status(200).json(body);
});

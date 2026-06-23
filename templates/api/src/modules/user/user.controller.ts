import { AppDataSource } from "../../data-source";
import { User } from "./user.entity";
import { AuthenticatedRequest } from "../../middleware/auth";
import { NotFoundError } from "../../errors/NotFoundError";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../types/api";

export const getMe = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id: req.userId } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { password, ...safeUser } = user;
  const body: ApiResponse<typeof safeUser> = { data: safeUser };
  res.status(200).json(body);
});

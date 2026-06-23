import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { AppDataSource } from "./data-source";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import postsRoutes from "./modules/posts/post.routes";
import { errorHandler } from "./middleware/error";
import { notFound } from "./middleware/notFound";
import { logger } from "./utils/logger";

const app = express();
app.use(express.json());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/posts", postsRoutes);

app.use(notFound);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to initialize data source", err);
    process.exit(1);
  });

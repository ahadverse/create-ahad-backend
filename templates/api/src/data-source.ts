import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";
import { env } from "./config/env";
import { User } from "./modules/user/user.entity";
import { Post } from "./modules/posts/post.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  synchronize: false,
  entities: [User, Post],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
});

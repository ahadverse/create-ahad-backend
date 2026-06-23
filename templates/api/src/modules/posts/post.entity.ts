import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  RelationId,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "boolean", default: false })
  published!: boolean;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  author!: User;

  @RelationId((post: Post) => post.author)
  authorId!: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}

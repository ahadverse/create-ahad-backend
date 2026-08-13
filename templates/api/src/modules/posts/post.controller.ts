import { AppDataSource } from "../../data-source";
import { Post } from "./post.entity";
import { AuthenticatedRequest } from "../../middleware/auth";
import { NotFoundError } from "../../errors/NotFoundError";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse, Paginated } from "../../types/api";
import {
  createPostSchema,
  updatePostSchema,
  listPostsQuerySchema,
} from "./post.schemas";

export const listPosts = asyncHandler(async (req, res) => {
  const { page, limit } = listPostsQuerySchema.parse(req.query);
  const postRepo = AppDataSource.getRepository(Post);

  const [posts, total] = await postRepo.findAndCount({
    order: { createdAt: "DESC" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const body: Paginated<Post> = { data: posts, meta: { page, limit, total } };
  res.status(200).json(body);
});

export const getPost = asyncHandler(async (req, res) => {
  const postRepo = AppDataSource.getRepository(Post);
  const post = await postRepo.findOne({ where: { id: req.params.id } });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  const body: ApiResponse<Post> = { data: post };
  res.status(200).json(body);
});

export const createPost = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  const input = createPostSchema.parse(req.body);
  const postRepo = AppDataSource.getRepository(Post);

  const post = postRepo.create({
    ...input,
    published: input.published ?? false,
    author: { id: req.userId } as Post["author"],
  });
  await postRepo.save(post);

  const body: ApiResponse<Post> = { data: post };
  res.status(201).json(body);
});

export const updatePost = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  const input = updatePostSchema.parse(req.body);
  const postRepo = AppDataSource.getRepository(Post);

  // authorId comes from @RelationId, so ownership is checked without loading the author.
  const post = await postRepo.findOne({ where: { id: req.params.id } });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (post.authorId !== req.userId) {
    throw new ForbiddenError("You do not own this post");
  }

  Object.assign(post, input);
  await postRepo.save(post);

  const body: ApiResponse<Post> = { data: post };
  res.status(200).json(body);
});

export const deletePost = asyncHandler<AuthenticatedRequest>(async (req, res) => {
  const postRepo = AppDataSource.getRepository(Post);

  const post = await postRepo.findOne({ where: { id: req.params.id } });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  if (post.authorId !== req.userId) {
    throw new ForbiddenError("You do not own this post");
  }

  await postRepo.remove(post);
  res.status(204).send();
});

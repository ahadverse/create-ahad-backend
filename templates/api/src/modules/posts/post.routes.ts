import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { listPosts, getPost, createPost, updatePost, deletePost } from "./post.controller";

const router = Router();

router.get("/", listPosts);
router.get("/:id", getPost);
router.post("/", requireAuth, createPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

export default router;

import { Router } from "express";
import blogControllers from "./controllers/index.blog.controller";

const router = Router();

router.route("/").get(blogControllers.handleGetAllBlogs);
router.route("/:blogId").get(blogControllers.handleGetByIdBlog);

export default router;

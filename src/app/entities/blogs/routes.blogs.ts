import { Router } from "express";
import blogControllers from "./controllers/index.blog.controller";

const router = Router();

router.route("/").get(blogControllers.handleGetAllBlogs);
router.route("/:slug").get(blogControllers.handleGetBySlugBlog);

export default router;

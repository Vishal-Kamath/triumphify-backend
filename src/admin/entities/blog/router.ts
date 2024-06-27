import { Router } from "express";
import blogControllers from "./controllers/index.blog.controller";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import { blogValidator, linkToBanner } from "./validators";

const router = Router();

router
  .route("/")
  .get(blogControllers.handleGetAllBlogs)
  .post(
    validateResources(blankSchema, blogValidator, blankSchema),
    blogControllers.handleCreateBlogDraft
  )
  .put(
    validateResources(blankSchema, blogValidator, blankSchema),
    blogControllers.handleEditBlog
  );

router
  .route("/:blogId")
  .get(blogControllers.handleGetByIdBlog)
  .delete(blogControllers.handleDeleteBlog);

router
  .route("/:blogId/link")
  .post(
    validateResources(blankSchema, linkToBanner, blankSchema),
    blogControllers.handleLinkBlogToBanner
  );

export default router;

import handleCreateBlogDraft from "./create.blog.controller";
import handleDeleteBlog from "./delete.blogs.controller";
import handleEditBlog from "./edit.blogs.controller";
import handleGetAllBlogs from "./get.blogs.controller";
import handleGetByIdBlog from "./get.byId.blogs.controller";
import handleLinkBlogToBanner from "./link.blog.to.banner";

export default {
  handleCreateBlogDraft,
  handleGetAllBlogs,
  handleGetByIdBlog,
  handleEditBlog,
  handleDeleteBlog,
  handleLinkBlogToBanner,
};

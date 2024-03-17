import handleCreateProduct from "./create.products.contollers";
import handleGetProducts from "./get.products.controller";
import handleGetByIdProducts from "./get.byId.products.controller";
import handleDeleteProduct from "./delete.product.controllers";
import handleUpdateProduct from "./update.products.controllers";
import handleGetAllReviewsList from "./get.all.reviews.list.products.controller";
import handleGetReviewStats from "./get.review.stats.controllers";
import handleGetAllReviews from "./get.all.reviews.products.controller";
import handleUserReviewsPinned from "./update.user.review.pinned.products.controller";
import handleUserReviewsStatus from "./update.user.review.status.products.controller";

export default {
  handleCreateProduct,
  handleGetProducts,
  handleGetByIdProducts,
  handleDeleteProduct,
  handleUpdateProduct,
  handleGetAllReviewsList,
  handleGetReviewStats,
  handleGetAllReviews,
  handleUserReviewsPinned,
  handleUserReviewsStatus,
};

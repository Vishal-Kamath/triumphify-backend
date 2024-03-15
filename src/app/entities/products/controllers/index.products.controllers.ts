import handleGetProductMeta from "./get.meta.products.controllers";
import handleGetProduct from "./get.product.controller";
import handleGetProductShowcase from "./get.showcase.products.controller";
import handleGetProductBuyDetails from "./get.product-buy.controllers";
import handleCreateUserProductReview from "./create.user.review.products.controller";
import handeGetByIdUserReview from "./get.byId.user.review.products.controller";
import handleUpdateUserProductReview from "./update.user.review.products.controller";
import handleDeleteUserReview from "./delete.user.review.products.controller";
import handleGetAllReviews from "./get.all.reviews.products.controller";
import handleGetReviewStats from "./get.stats.reviews.products.controller";

export default {
  handleGetProductMeta,
  handleGetProduct,
  handleGetProductShowcase,
  handleGetProductBuyDetails,
  handleCreateUserProductReview,
  handeGetByIdUserReview,
  handleUpdateUserProductReview,
  handleDeleteUserReview,
  handleGetAllReviews,
  handleGetReviewStats,
};

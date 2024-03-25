import handleGetAllOrders from "./get.all.orders.controllers";
import handleGetByIdOrdersControllers from "./get.byId.orders.controllers";
import handleOrderAnalyticsList from "./get.analytics.order.controller";
import handleGetVariationSales from "./get.variation.order.controller";
import handleUpdateOrderStatus from "./update.status.controllers";
import handleCancelOrder from "./cancel.orders.controllers";

export default {
  handleGetAllOrders,
  handleGetByIdOrdersControllers,
  handleOrderAnalyticsList,
  handleGetVariationSales,
  handleUpdateOrderStatus,
  handleCancelOrder,
};

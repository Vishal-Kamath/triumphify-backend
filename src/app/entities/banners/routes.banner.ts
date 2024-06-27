import { Router } from "express";
import bannerControllers from "./controllers/index.banners.controllers";

const router = Router();

router.get("/linked_content", bannerControllers.handleGetLinkedContent);
router.get("/:type", bannerControllers.handleGetBanners);

export default router;

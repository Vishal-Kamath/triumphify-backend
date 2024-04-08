import { Router } from "express";
import sessionControllers from "./controllers/index.session.controllers";

const router = Router();

router.get("/", sessionControllers.handleGetSession);

export default router;

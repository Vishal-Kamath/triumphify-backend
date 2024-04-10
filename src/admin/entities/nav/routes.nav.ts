import { Router } from "express";
import handleNav from "./controllers/index.nav.controllers";

const router = Router();

router.get("/", handleNav);

export default router;

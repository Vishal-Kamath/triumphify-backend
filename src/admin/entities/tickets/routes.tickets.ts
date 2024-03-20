import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { Router } from "express";
import ticketControllers from "./controllers/index.tickets.controllers";

const router = Router();

router.route("/").get(ticketControllers.handleGetAllTickets);

export default router;

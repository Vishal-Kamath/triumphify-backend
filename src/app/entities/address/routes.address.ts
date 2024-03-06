import { Router } from "express";
import addressControllers from "./controllers/index.address.controllers";
import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { address } from "./validators.address";

const router = Router();

router
  .route("/")
  .get(addressControllers.handleGetAllAddresses)
  .post(
    validateResources(blankSchema, address, blankSchema),
    addressControllers.handleCreateAddress
  );

router
  .route("/:addressId")
  .get(addressControllers.handleAddressGetById)
  .put(
    validateResources(blankSchema, address, blankSchema),
    addressControllers.handleUpdateAddress
  )
  .delete(addressControllers.handleDeleteAddress);

export default router;

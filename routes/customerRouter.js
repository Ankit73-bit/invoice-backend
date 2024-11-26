import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
} from "../controllers/customerController.js";

export const router = express.Router();

router.route("/").get(getAllCustomers).post(createCustomer);

router
  .route("/:id")
  .get(getCustomer)
  .patch(updateCustomer)
  .delete(deleteCustomer);

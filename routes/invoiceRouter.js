import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoice,
  getInvoicesStats,
  updateInvoice,
} from "../controllers/invoiceController.js";
import { protect, restrictTo } from "../controllers/authController.js";

export const router = express.Router();

router.route("/").get(protect, getAllInvoices).post(createInvoice);

router.route("/invoice-stats").get(getInvoicesStats);

router
  .route("/:id")
  .get(getInvoice)
  .put(updateInvoice)
  .delete(protect, restrictTo("admin"), deleteInvoice);

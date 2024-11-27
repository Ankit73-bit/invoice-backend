import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoice,
  getInvoicesStats,
  updateInvoice,
} from "../controllers/invoiceController.js";

export const router = express.Router();

router.route("/").get(getAllInvoices).post(createInvoice);

router.route("/invoice-stats").get(getInvoicesStats);

router.route("/:id").get(getInvoice).put(updateInvoice).delete(deleteInvoice);

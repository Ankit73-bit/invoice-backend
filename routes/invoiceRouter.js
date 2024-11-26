import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoice,
  getLastInvoice,
  updateInvoice,
} from "../controllers/invoiceController.js";

export const router = express.Router();

router.route("/").get(getAllInvoices).post(createInvoice);
router.route("/last").get(getLastInvoice);

router.route("/:id").get(getInvoice).put(updateInvoice).delete(deleteInvoice);

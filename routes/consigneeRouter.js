import express from "express";
import {
  createConsingee,
  deleteConsingee,
  getAllConsingees,
  getConsingee,
  updateConsingee,
} from "../controllers/consigneeController.js";

export const router = express.Router();

router.route("/").get(getAllConsingees).post(createConsingee);

router
  .route("/:id")
  .get(getConsingee)
  .patch(updateConsingee)
  .delete(deleteConsingee);

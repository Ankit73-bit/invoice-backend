import express from "express";
import {
  createClient,
  deleteClient,
  getAllClients,
  getClient,
  updateClient,
} from "../controllers/clientController.js";

export const router = express.Router();

router.route("/").get(getAllClients).post(createClient);

router.route("/:id").get(getClient).patch(updateClient).delete(deleteClient);

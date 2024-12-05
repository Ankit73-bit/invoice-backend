import express from "express";
import { getAllCounters } from "../controllers/counterController.js";

export const router = express.Router();

router.route("/").get(getAllCounters);

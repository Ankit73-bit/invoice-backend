import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";

export const router = express.Router();

router.route("/").get(getAllUser).post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

import express from "express";
import morgan from "morgan";
import { router as invoiceRouter } from "./routes/invoiceRouter.js";
import { router as customerRouter } from "./routes/clientRouter.js";
import { router as consigneeRouter } from "./routes/consigneeRouter.js";
import { router as itemRouter } from "./routes/itemRouter.js";
import { router as userRouter } from "./routes/userRouter.js";
import cors from "cors";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

const app = express();

// Configure CORS
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/clients", customerRouter);
app.use("/api/v1/consignees", consigneeRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;

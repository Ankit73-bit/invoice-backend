import express from "express";
import morgan from "morgan";
import { router as invoiceRouter } from "./routes/invoiceRouter.js";
import { router as customerRouter } from "./routes/customerRouter.js";
import { router as consigneeRouter } from "./routes/consigneeRouter.js";
import { router as itemRouter } from "./routes/itemRouter.js";
import { router as userRouter } from "./routes/userRouter.js";
import cors from "cors";

const app = express();

// Configure CORS
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow methods you plan to use
    credentials: true, // Allow credentials if you're using cookies/sessions
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/consignees", consigneeRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/users", userRouter);

export default app;

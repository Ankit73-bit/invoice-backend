import app from "./app.js";
import mongoose from "mongoose";
import "dotenv/config";

const DB = process.env.DATABASE.replace(
  "<db_password>",
  encodeURIComponent(process.env.DATABASE_PASSWORD)
);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database successfully!"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

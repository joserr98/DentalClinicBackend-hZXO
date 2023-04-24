import config from "./conf.js";
import express from "express";
import mongoose, { ConnectOptions } from "mongoose";

const app = express();
const mongooseConnection = mongoose.connect(config.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

mongooseConnection
  .then(() => console.log("Todo OK ✓"))
  .catch((err) => {
    console.log("No funciona", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Todo funciona" });
});

app.use(express.json());

app.listen(config.PORT, () =>
  console.log(`Servidor levantado en ${config.PORT} ✓`)
);

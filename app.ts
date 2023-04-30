import config from "./core/conf.js"
import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import appointmentRouters from './entities/appointment/router.js'
import routerUser from "./entities/user/router.js";
import { handlerError } from './core/middleware.js'

const app = express();
const mongooseConnection = mongoose.connect(config.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

mongooseConnection
  .then(() => console.log("Mongoose connection ✔"))
  .catch((err) => {
    console.log("Not working ✘", err);
  });

app.use(express.json());
app.use("/appointment", appointmentRouters);
app.use('/user',routerUser)
app.use(handlerError);
app.listen(config.PORT, () =>
  console.log(`Server up on port: ${config.PORT} ✔`)
);

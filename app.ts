import config from "./core/conf.js"
import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import appointmentRouters from './entities/appointment/router.js'
import routerUser from "./entities/user/router.js";
import { handlerError } from './core/middleware.js'
import cors from 'cors'

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

  let corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    // allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
    optionsSuccessStatus: 204
};

app.use(express.json());
app.use(cors(corsOptions))
app.use("/appointment", appointmentRouters);
app.use('/user',routerUser)
app.use(handlerError);
app.listen(config.PORT, () =>
  console.log(`Server up on port: ${config.PORT} ✔`)
);

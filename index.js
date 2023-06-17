import express from "express";
import slowDown from "express-slow-down";
import rateLimit from "express-rate-limit";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import shorcodeApi from "./apis/shortcode.js";
import authenticateApi from "./apis/authentication.js";
import dotenv from "dotenv";
import cors from "cors";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" });
}

const app = express();
const port = 5000;

const throttle = slowDown({
  windowMs: 60 * 1000, // Throttling window: 1 minute
  delayAfter: 100, // Start delaying responses after 100 requests
  delayMs: 500, // Delay each response by 500 milliseconds
});

const limiter = rateLimit({
  windowMs: 60 * 1000, // Throttling window: 1 minute
  max: 20, // Maximum number of requests per windowMs
});

connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log(`MongoDB connected successfully`);
  })
  .catch((err) => console.log(err));


app.use(bodyParser.json());
app.use(cors());
app.use(throttle);
app.use(limiter);

app.use("/", authenticateApi);
app.use("/", shorcodeApi);

app.listen(port, () => {
  console.log("listening on port " + port);
});

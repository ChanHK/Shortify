import express from "express";
import slowDown from "express-slow-down";
import rateLimit from "express-rate-limit";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import api from "./api.js";

const app = express();
const port = 5000;

const throttle= slowDown({
  windowMs: 60 * 1000, // Throttling window: 1 minute
  delayAfter: 100, // Start delaying responses after 100 requests
  delayMs: 500, // Delay each response by 500 milliseconds
});

const limiter = rateLimit({
  windowMs: 60 * 1000, // Throttling window: 1 minute
  max: 5, // Maximum number of requests per windowMs
});

app.use(bodyParser.json());

const mongoUrl = "mongodb://0.0.0.0:27017/shortify";
connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log(`MongoDB connected successfully`);
  })
  .catch((err) => console.log(err));

app.use(throttle);
app.use(limiter);

app.use("/", api);

app.listen(port, () => {
  console.log("listening on port " + port);
});

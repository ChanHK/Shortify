import express from "express";
import { connect } from "mongoose";
import api from "./api.js";

const app = express();
const port = 5000;

const mongoUrl = "mongodb://0.0.0.0:27017/shortify";
connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log(`MongoDB connected successfully`);
  })
  .catch((err) => console.log(err));

app.use("/shortify/api", api);

app.listen(port, () => {
  console.log("listening on port " + port);
});

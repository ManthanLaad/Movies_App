const config = require("config");
const mongoose = require("mongoose");

mongoose
  .connect(config.get("MongoDB_URL"), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Success"))
  .catch((e) => console.log(`Failed Connection :${e}`));

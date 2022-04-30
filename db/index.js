const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/graphql-test");

mongoose.connection
  .once("open", () => console.log("Database Connection Established 🌞"))
  .on("error", (error) => {
    console.error("Someting went wrong " + error);
  });

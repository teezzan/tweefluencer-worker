var mongoose = require("mongoose");
let MONGO_URL = process.env.MONGO_URL || "mongodb+srv://commitspy:commitspy@cluster0.4s2rm.mongodb.net/twf1?retryWrites=true&w=majority";

mongoose.connect(
  MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  (err) => {
    if (err) {
      console.log("Failed to Connect");
    }
    else {
      console.log("Connection Successful ");
    }
  }
);

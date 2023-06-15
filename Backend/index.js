const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");

const authRoute = require("./Routes/Auth")

app.use(express.json());
app.use(cors());
app.use(morgan("common"));
app.use("/auth" , authRoute)

dotenv.config();
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connectToMongoDB();

app.listen(4000, () => {
  console.log("server running on port 4000");
});

const express = require("express");
const { connection } = require("./configs/db");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { userRouter } = require("./routes/User.routes");
const { authenticate } = require("./middlewares/Authenticate.middleware");
const { postRouter } = require("./routes/Post.routes");


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome To Home Page");
});


//userRouter for register and login

app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts", postRouter);


app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (error) {
    console.log({ msg: "Cannot connect to the DB", error: error.message });
  }

  console.log(`Server is listening at ${process.env.port}`);
});

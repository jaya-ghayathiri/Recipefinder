const express = require("express");
const db = require('mongoose')
const app = express();
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();

app.use(express.json());
app.use(cors());

const connectToDb = require("./db/config");
const Home = require("./controllers/controller");
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const verifyToken = require("./Middleware/middleware");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");

app.use("/auth", LoginRoute);
app.use("/auth", RegisterRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", router);
app.use("/auth", ForgotPassword);

router.get("/", verifyToken, Home.Home);

module.exports = router;

const connectDb = async ()=>{
  try{
    await db.connect(process.env.MONGODB_URI)
    console.log("DB connected Successful...")
    app.listen(process.env.PORT,()=>{
      console.log("Server Started...")
    })
  }catch(err){
    console.log(err)
  }
}

connectDb()
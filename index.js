const express = require("express");
const appRoute = require("./routes/route");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const {
  Login,
  Register,
  Logout,
} = require("./controllers/Auth");
const {
  CheckValidationAuth,
  CheckValidationRegister,
} = require("./config/Checker");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:3000","https://musclemassapp.vercel.app"],
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send({ msg: "💤welcome to api muscle mass app 💤" });
});

app.post("/api/v1/auth/login", CheckValidationAuth, Login);
app.post("/api/v1/auth/signup", CheckValidationRegister, Register);
app.post("/api/v1/auth/logout", Logout);
app.use("/", appRoute);

app.listen(8080, () => {
  console.log("Server Berjalan di Port : http://localhost:8080");
});

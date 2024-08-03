const express = require("express");
const appRoute = require("./routes/route");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require('express-rate-limit');


const app = express();
const { Login, Register, Logout, RegisterV2 } = require("./controllers/Auth");
const {
  CheckValidationAuth,
  CheckValidationRegister,
} = require("./config/Checker");
const ApiResponse = require("./config/ApiResponse");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://musclemassapp.vercel.app"],
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 menit
  max: 25, // membatasi setiap IP menjadi 100 permintaan per windowMs
  message: ApiResponse( "Terlalu banyak melakukan request", false, 500, []),
  headers: true,
});

// app.use(limiter);
app.get("/", (req, res) => {
  res.status(200).send({ msg: "💤welcome to api muscle mass app 💤" });
});

app.post("/api/v1/auth/login", CheckValidationAuth, Login);
app.post("/api/v1/auth/signup", CheckValidationRegister, Register);
// app.post("/api/v2/auth/signupv2", RegisterV2);
app.post("/api/v1/auth/logout", Logout);
app.use("/", appRoute);

app.listen(8080, () => {
  console.log("Server Berjalan di Port : http://localhost:8080");
});

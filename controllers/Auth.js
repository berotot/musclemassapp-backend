const { connectToDatabase } = require("../config/database");
const { ApiResponse } = require("../config/ApiResponse.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
require("dotenv").config();

module.exports = {
  Login: async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const db = await connectToDatabase();
      const collection = db.collection("users");
      const result = await collection.findOne(
        {
          email: email,
          password: password,
        },
        {
          projection: { username: 1, _id: 1 },
        }
      );
      if (result) {
        const payload = {
          email: result.email,
          _id: await result._id.toString(),
        };
        const token = jwt.sign(payload, process.env.KEY_PRIVATE, {
          expiresIn: "1d",
        });
        return res
          .status(200)
          .send(
            ApiResponse("Berhasil melakukan login", true, 200, { token: token })
          );
      }

      return res
        .status(401)
        .send(ApiResponse("Email atau password salah ", false, 401, []));
    } catch (error) {
      return res.status(500).send(ApiResponse( "Ada problem nih " + error , false, 500, []));
    }
  },
  Register: async (req, res) => {
    const data = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: "visitor",
      profilePath: null,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("users");
      const result = await collection.findOne({
        email: data.email,
      });
      if (result) {
        return res
          .status(400)
          .send(ApiResponse("Email kamu sudah di gunakan", false, 400, []));
      }
      if (data.password.length < 8) {
        return res
          .status(400)
          .send(ApiResponse("Password harus lebih dari 8", false, 400, []));
      }
      // data.password =  data.password
      collection.insertOne(data);
      return res
        .status(200)
        .send(ApiResponse("Akun kamu sudah bisa di gunakan", true, 200, []));
    } catch (error) { 
      return res.status(500).send(ApiResponse( "Ada problem nih " + error , false, 500, []));
    }
  },
  RegisterV2: async (req, res) => {
    const data = {
      username: req.body.username,
      email: req.body.username+"@gmail.com",
      password: req.body.username,
      role: "visitor",
      profilePath: null,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("users");
      const result = await collection.findOne({
        username: data.username,
      });
      if (result) {
        return res
          .status(400)
          .send(ApiResponse("Username sudah di gunakan", false, 400, []));
      }
     
      // data.password =  data.password
       await collection.insertOne(data);
      return res
        .status(200)
        .send(ApiResponse("Akun kamu sudah bisa di gunakan", true, 200, [{username:data.username,email:data.email,password:data.password}]));
    } catch (error) {
      return res.status(500).send(ApiResponse( "Ada problem nih " + error , false, 500, []));
    }
  },
  VerifyToken: (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization ? authorization.split(" ")[1] : null;
    if (!token) {
      return res.status(401).send(ApiResponse( "Silahkan login dahulu" , false, 401, result));
    }
    jwt.verify(token, process.env.KEY_PRIVATE, (err, decoded) => {
      if (err) {
        return res.status(401).send(ApiResponse( "Sesi kamu sudah habis" + err , false, 401, result));
      } else {
        req.user = decoded;
        next();
      }
    });
  },
  Logout: async (req, res) => {
    // req.session = null;
    return res
      .status(200)
      .send(ApiResponse("Logout berhasil 🙊 ", false, 200, []));
  },
  ValidRoleAdmin: async (req, res, next) => {
    const db = await connectToDatabase();
    const collection = db.collection("users");

    const role = await collection.findOne(
      {
        _id: new ObjectId(req.user._id),
      },
      {
        projection: { role: 1 },
      }
    );

    if (role === null) {
      return res
        .status(403)
        .send(ApiResponse("Ini siapa ya ? 🙈 ", false, 403, []));
    }
    if (role.role !== "_adminX69_") {
      return res
        .status(403)
        .send(ApiResponse("Dilarang ke sini admin punya 🙈 ", false, 403, []));
    }
    next();
  },
  ValidRoleVisitor: async (req, res, next) => {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const role = await collection.findOne(
      {
        _id: new ObjectId(req.user._id),
      },
      {
        projection: { role: 1 },
      }
    );
    if (role === null) {
      return res
        .status(403)
        .send(ApiResponse("Ini siapa ya ? 🙈 ", false, 403, []));
    }

    if (role.role !== "visitor") {
      return res
        .status(403)
        .send(ApiResponse("Dilarang ke sini pengujung punya 🙈 ", false, 403, []));
    }

    next();
  },
  ValidUserSess: async (req, res, next) => {
    if (!req.session.isLogin) {
      return res
        .status(401)
        .send(
          ApiResponse("sesi akun kamu uzur,login lagi ya 🙊 ", false, 401, [])
        );
    }
    next();
  },
};

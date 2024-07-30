const multer = require("multer");
const path = require("path");
const { ApiResponse } = require("./ApiResponse");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./etc/uploads"); // Simpan file di folder 'uploads/'
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("error file type"), false);
  }
};
const limits = {
  fileSize: 5 * 1024 * 1024,
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

const profil = upload.fields([{ name: "profilPath" }]);
const content = upload.fields([{ name: "contentPath" }]);

module.exports = {
  HandleUploadProfil: async (req, res, next) => {
    profil(req, res, function (err) {
      if (err) {
        return res
          .status(400)
          .send(ApiResponse("Ada kesalahan " + err, false, 400, []));
      }
      next();
    });
  },
  HandleUploadContent: async (req, res, next) => {
    content(req, res, function (err) {
      if (err) {
        return res
          .status(400)
          .send(ApiResponse("Ada kesalahan " + err, false, 400, []));
      }
      next();
    });
  },
};

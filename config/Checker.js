const { ApiResponse } = require("./ApiResponse");

const Ngeregex = (param) => {
  if (!/^[a-zA-Z0-9\s:.,@-]+$/.test(param)) {
    return true;
  }
};

module.exports = {
  CheckValidationAuth: async (req, res, next) => {
    let email = req.body.email;
    let pass = req.body.password;
    if (email === "" || pass === "") {
      return res
        .status(401)
        .send(
          ApiResponse("Email dan password tidak boleh kosong.", false, 401, [])
        );
    }

    if (Ngeregex(email) || Ngeregex(pass)) {
      return res
        .status(401)
        .send(
          ApiResponse(
            "Email dan password hanya boleh mengandung huruf dan angka.",
            false,
            401,
            []
          )
        );
    }
    next();
  },
  CheckInputRegexOnEmpty: async (req, res, next) => {
    const check = req.body;
    let hasError = false;
    let hasRegex = false;
    const antiCheck = ["profilePath","contentPath"];

    antiCheck.forEach((res) => {
      delete check[res];
    });

    Object.values(check).forEach((value, key) => {
      if (value === "" || value === null) {
        hasError = true;
      } else if (Ngeregex(value)) {
        hasRegex = true;
      }
    });

    if (hasError) {
      return res
        .status(400)
        .send(ApiResponse("Data tidak boleh kosong", false, 400, []));
    }
    if (hasRegex) {
      return res
        .status(400)
        .send(
          ApiResponse("Data tidak boleh mengandung karakter", false, 400, [])
        );
    }
    next();
  },
  CheckValidationRegister: async (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    if (!email || !username || !password) {
      return res
        .status(400)
        .send(ApiResponse("Data tidak boleh kosong", false, 400, []));
    }
    if (Ngeregex(username) || Ngeregex(password) || Ngeregex(email)) {
      return res
        .status(400)
        .send(
          ApiResponse(
            "Username dan password hanya boleh mengandung huruf dan angka.",
            false,
            400,
            []
          )
        );
    }
    next();
  },
};

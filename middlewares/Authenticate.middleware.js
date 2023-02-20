const jwt = require("jsonwebtoken");

require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const decode = jwt.verify(token, process.env.secret_key);
    if (decode) {
      //console.log(decode);
      //req.body.user = decode.userId;
      next();
    }
  } else {
    res.status(501).send({ msg: "please login first" });
  }
};

module.exports = { authenticate };

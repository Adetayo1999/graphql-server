const { sign } = require("jsonwebtoken");

const createAccessToken = (payload) => {
  return sign(payload, "sometokensecret", {
    expiresIn: "10minutes",
  });
};

const createRefreshToken = (payload) => {
  return sign(payload, "somerefreshtokensecret", {
    expiresIn: "7 days",
  });
};

module.exports = { createAccessToken, createRefreshToken };

const { verify } = require("jsonwebtoken");

module.exports = (req) => {
  const authorization = req.headers.authorization;
  if (!authorization) throw new Error("Not Authorized Request");
  const token = authorization.split(" ")[1];
  if (!token) throw new Error("Not Authorized Request");
  const payload = verify(token, "sometokensecret");
  return payload;
};

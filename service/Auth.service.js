const { hash, compare } = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const Token = require("../model/token.model");
const User = require("../model/user.model");
const { createAccessToken, createRefreshToken } = require("../utils/token");

class Authentication {
  async createUser(_user) {
    const user = await User.findOne({ email: _user.email });
    if (user) throw new Error("Email In Use");
    const hashedPassword = await hash(_user.password, 8);
    const newUser = new User({ ..._user, password: hashedPassword });
    await newUser.save();
    return newUser;
  }
  async loginUser(_user) {
    const user = await User.findOne({ email: _user.email });
    if (!user) throw new Error("Invalid email/password");
    const correctPassword = await compare(_user.password, user.password);
    if (!correctPassword) throw new Error("Invalid email/password");
    const token = createAccessToken({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    const refreshToken = createRefreshToken({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    const _refreshToken = new Token({ token: refreshToken, userId: user.id });
    await _refreshToken.save();
    return { token, refreshToken };
  }

  async getNewToken(req) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error("Session Expired");
    const { id, firstName, lastName } = verify(
      refreshToken,
      "somerefreshtokensecret"
    );
    const dbRefreshToken = await Token.findOne({ userId: id });
    if (!dbRefreshToken) throw new Error("Session Expired");
    const token = createAccessToken({
      id,
      firstName,
      lastName,
    });
    return token;
  }
  async logoutUser(req) {
    const payload = verify(req.cookies.refreshToken, "somerefreshtokensecret");
    await Token.deleteOne({ userId: payload.id });
  }
}

module.exports = Authentication;

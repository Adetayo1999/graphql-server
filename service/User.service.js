const User = require("../model/user.model");

class UserProfile {
  async getUser(id) {
    const user = await User.findById(id);
    return user;
  }
}

module.exports = UserProfile;

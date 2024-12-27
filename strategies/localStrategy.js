const { User } = require("../configs/db");
const bcrypt = require("bcryptjs");

const Strategy = require("passport-local").Strategy;

module.exports = new Strategy(async (username, password, done) => {
  if (!username || !password) {
    return done(null, false);
  }
  const user = await User.findOne({
    where: {
      username,
    },
    raw: true,
  });

  if (!user) {
    return done(null, false);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return done(null, false);
  }

  return done(null, user);
});

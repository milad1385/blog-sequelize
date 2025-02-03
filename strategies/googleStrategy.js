const { default: slugify } = require("slugify");
const { User } = require("../configs/db");
const constant = require("../constants/constant");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = new GoogleStrategy(
  {
    clientID: constant.auth.google.clientId,
    clientSecret: constant.auth.google.clientSecret,
    callbackURL: `${constant.domain}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const avatar = profile.photos[0].value;

    const user = await User.findOne({ where: { email }, raw: true });

    if (user) {
      return done(null, user);
    }

    const name = `${profile.name.givenName} ${profile.name.familyName}`;
    const username =
      slugify(name, { lower: true }).replace(/[\.-]/g, "") +
      Math.floor(1000 + Math.random() * 9000);

    const newUser = await User.create({
      name,
      username,
      email,
      provider: "google",
      avatar,
    });

    done(null, newUser);
  }
);

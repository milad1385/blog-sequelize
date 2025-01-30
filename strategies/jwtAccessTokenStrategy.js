const { User } = require("../configs/db");
const constant = require("../constants/constant");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
    secretOrKey: constant.auth.accessTokenKey,
  },
  async (payload, done) => {
    console.log("payload => ", payload);
    const user = await User.findByPk(payload.id, {
      raw: true,
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) return done(null, false);

    done(null, user);
  }
);

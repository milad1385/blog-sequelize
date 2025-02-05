const { User } = require("../configs/db");
const redis = require("../configs/redis");
const constant = require("../constants/constant");
const bcrypt = require("bcryptjs");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: constant.auth.refreshTokenKey,
    passReqToCallback: true,
  },
  async (payload, done) => {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const user = await User.findByPk(payload.id, { raw: true });

    if (!user) {
      return done(null, false);
    }

    const hashedRefreshToken = await redis.get(`refreshToken:${user.id}`);

    if (!hashedRefreshToken) {
      return done(null, false);
    }

    const isValidHashedRefreshToken = await bcrypt.compare(
      refreshToken,
      hashedRefreshToken
    );

    if (!isValidHashedRefreshToken) {
      return done(null, false);
    }

    done(null, user);
  }
);

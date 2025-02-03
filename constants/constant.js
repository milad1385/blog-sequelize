require("dotenv").config();

module.exports = {
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    name: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 3306,
  },
  auth: {
    accessTokenKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_SECRET_KEY,
    accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE_IN_SECONDS,
    refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE_IN_SECONDS,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  domain :process.env.APP_DOMAIN,
  port: process.env.PORT || 4000,
  redis: {
    uri: process.env.REDIS_URI,
  },
  logging: process.env.NODE_ENV === "production",
};

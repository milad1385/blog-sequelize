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
  auth: {},
  google: {},
  port: process.env.PORT || 4000,
  redis: {
    uri: process.env.REDIS_URI,
  },
  logging: process.env.NODE_ENV === "production",
};

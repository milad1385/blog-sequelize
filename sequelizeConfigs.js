const configs = require("./constants/constant");

module.exports = {
  development: {
    username: configs.db.username,
    password: configs.db.password,
    database: configs.db.name,
    host: configs.db.host,
    dialect: configs.db.dialect,
    port: configs.db.port,
  },
  test: {
    username: configs.db.user,
    password: configs.db.password,
    database: configs.db.name,
    host: configs.db.host,
    dialect: configs.db.dialect,
    port: configs.db.port,
  },
  production: {
    username: configs.db.user,
    password: configs.db.password,
    database: configs.db.name,
    host: configs.db.host,
    dialect: configs.db.dialect,
    port: configs.db.port,
  },
};

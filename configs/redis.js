const Redis = require("ioredis");
const constant = require("../constants/constant");

const redis = new Redis(constant.redis.uri);

module.exports = redis;

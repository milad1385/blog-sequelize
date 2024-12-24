const Redis = require("ioredis");
const constant = require("../constants/constant");

const redis = new Redis(constant.redis.uri);

const redisConnection = async () => {
  const values = await redis.get("password");

  console.log(values);
};

redisConnection();

module.exports = redis;

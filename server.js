const app = require("./app");
require("dotenv").config();
const { db } = require("./configs/db");
const redis = require("./configs/redis");

const startServer = async () => {
  try {
    await db.authenticate();
    await redis.ping();

    app.listen(process.env.PORT || 4002, () => {
      console.log(`server running on port ${process.env.PORT}`);
    });
    
  } catch (error) {
    console.log("error -> ", error.message);

    await db.close();
    await redis.disconnect();
  }
};

startServer();

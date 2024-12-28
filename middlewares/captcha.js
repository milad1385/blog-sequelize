const redis = require("../configs/redis");

module.exports = async (req, res, next) => {
  try {
    const { uuid, captchaCode } = req.body;

    const captcha = await redis.get(`captcha:${uuid}`);

    if (captcha) {
      await redis.del(`captcha:${uuid}`);
    }

    if (captcha !== captchaCode.toLowerCase()) {
      return res
        .status(401)
        .json({ message: "The captcha code is invalid !!!" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

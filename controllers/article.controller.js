const { default: slugify } = require("slugify");

exports.create = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    let slug = slugify(title, { lower: true });

    console.log("[article created successfully :) ✌️]");
  } catch (error) {
    next(error);
  }
};

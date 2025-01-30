exports.create = async (req, res, next) => {
  try {
    console.log("[article created successfully :) ✌️]");
  } catch (error) {
    next(error);
  }
};

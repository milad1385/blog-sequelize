const app = require("./app");
require("dotenv").config();
require("./configs/db")

app.listen(process.env.PORT || 4002, () => {
  console.log(`server running on port ${process.env.PORT}`);
});

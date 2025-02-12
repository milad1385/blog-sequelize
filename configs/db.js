const { Sequelize } = require("sequelize");
const constant = require("../constants/constant");

const db = new Sequelize({
  host: constant.db.host,
  username: constant.db.username,
  password: constant.db.password,
  dialect: constant.db.dialect,
  database: constant.db.name,
  logging: constant.logging ? false : console.log,
});

//* JsDoc
/** @type {import('sequelize').ModelCtor<import('sequelize').Model<any, any>} */
const User = require("../models/User")(db);
/** @type {import('sequelize').ModelCtor<import('sequelize').Model<any, any>} */
const Tag = require("../models/Tags")(db);
/** @type {import('sequelize').ModelCtor<import('sequelize').Model<any, any>} */
const TagArticle = require("../models/TagsArticles")(db);
/** @type {import('sequelize').ModelCtor<import('sequelize').Model<any, any>} */
const Article = require("../models/Articles")(db);

User.hasMany(Article, {
  foreignKey: "author_id",
  onDelete: "CASCADE",
});

Article.belongsTo(User, { foreignKey: "author_id", as: "author" });

Article.belongsToMany(Tag, {
  through: TagArticle,
  onDelete: "CASCADE",
  foreignKey: "article_id",
});

Tag.belongsToMany(Article, {
  through: TagArticle,
  onDelete: "CASCADE",
  foreignKey: "tag_id",
});

module.exports = { db, User, Tag, TagArticle, Article };

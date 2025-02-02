const { default: slugify } = require("slugify");

const { Tag, Article, User } = require("../configs/db");
const deletePic = require("../utils/deletePic");

exports.create = async (req, res, next) => {
  console.log("req sended");

  try {
    let { title, content, tags } = req.body; // frontend -> ["frontend"]
    let slug = slugify(title, { lower: true });
    const copyOfSlug = slug;
    const authorId = req.user.id;

    tags = Array.isArray(tags) ? tags : [tags];

    tags = tags.map((tag) =>
      Tag.findOrCreate({ where: { title: tag.trim() }, raw: true })
    );
    tags = await Promise.all(tags);

    let article;
    let i = 1;
    const coverPath = `${req.file?.filename}`;

    while (!article) {
      try {
        article = await Article.create({
          title,
          content,
          slug,
          author_id: authorId,
          cover: coverPath,
        });

        const tagsToAdd = tags.map((tag) => tag[0]);

        await article.addTag(tagsToAdd);

        return res.status(201).json({
          ...article.dataValues,
          tags: tags.map((tag) => tag[0].title),
        });
      } catch (err) {
        if (err.original.code === "ER_DUP_ENTRY") {
          slug = `${copyOfSlug}-${i++}`;
        } else {
          throw err;
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.findBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res
        .status(422)
        .json({ message: "Please send slug in parameters" });
    }

    const article = await Article.findOne({
      where: { slug },
      attributes: {
        exclude: ["author_id"],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "provider"],
          },
          as: "author",
        },
        {
          model: Tag,
          attributes: ["title"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!article) {
      return res.status(404).json({ message: "article not found :(" });
    }

    const tags = article.dataValues.tags.map((tag) => tag.title);

    return res.json({ ...article.dataValues, tags });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log(id);
    

    if (!id) {
      return res
        .status(422)
        .json({ message: "Please send id in parameter :(" });
    }

    const article = await Article.findByPk(id, { raw: true });

    if (!article) {
      return res.status(404).json({ message: "Article not found :(" });
    }

    if (article.author_id !== req.user.id) {
      return res.status(403).json({ message: "forbidden action !!!" });
    }

    console.log(article.cover);
    

    deletePic(article.cover , "article");

    await Article.destroy({ where: { id } });

    return res.status(200).json({ message: "Article deleted successfully :)" });
  } catch (error) {
    next(error);
  }
};

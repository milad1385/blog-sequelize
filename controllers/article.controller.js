const { default: slugify } = require("slugify");

const { Tag, Article, User } = require("../configs/db");

exports.create = async (req, res, next) => {
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
    const coverPath = `images/covers/${req.file?.filename}`;

    while (!article) {
      try {
        article = await Article.create({
          title,
          content,
          slug,
          author_id: authorId,
          cover: coverPath,
        });

        await article.addTag(tags.map((tag) => tag[0]));

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
            exclude: ["password" , "provider"],
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

    console.log(article);

    if (!article) {
      return res.status(404).json({ message: "article not found :(" });
    }

    const tags = article.dataValues.tags.map((tag) => tag.title);

    return res.json({...article.dataValues, tags });
  } catch (error) {
    next(error);
  }
};

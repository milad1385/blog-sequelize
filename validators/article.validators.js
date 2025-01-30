const yup = require("yup");
const createNewArticleSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, "حداقل 3 کاراکتر برای عنوان وارد کنید ")
    .required("وارد کردن عنوان الزامی است"),
  content: yup
    .string()
    .min(10, "حداقل 10 کاراکتر برای توضیحات  کنید ")
    .required("وارد کردن توضیحات الزامی است"),

  tags: yup
    .mixed()
    .test(
      "is-string-or-array",
      "tags must be string or an array of string :(",
      (value) => {
        return (
          typeof value === "string" ||
          (Array.isArray(value) &&
            value.length &&
            value.every((item) => typeof item === "string"))
        );
      }
    )
    .required("وارد کردن تگ ها الزامی میباشد"),
});

module.exports = { createNewArticleSchema };

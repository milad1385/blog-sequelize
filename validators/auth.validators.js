const yup = require("yup");

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "حداقل کاراکتر نام 2 عدد است")
    .max(255, "حداکثر کاراکتر نام 255 عدد است")
    .required("وارد کردن نام الزامی است"),
  username: yup
    .string()
    .min(2, "حداقل کاراکتر نام کاربری 2 عدد است")
    .max(255, "حداکثر کاراکتر نام کاربری 255 عدد است")
    .required("وارد کردن نام کاربری الزامیست"),
  email: yup.string().email("فرمت ایمیل صحیح نیست").required("وارد کردن ایمیل الزامی است"),
  password: yup
    .string()
    .required("وارد کردن پسورد الزامی است")
    .min(8, "حداقل 8 کاراکتر وارد کنید")
    .max(24, "حداکثر 24 کاراکتر وارد کنید"),
  confirmPassword: yup
    .string()
    .required("وارد کردن پسورد الزامی است")
    .oneOf([yup.ref("password")])
    .min(8, "حداقل 8 کاراکتر وارد کنید")
    .max(24, "حداکثر 24 کاراکتر وارد کنید"),
});

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, "حداقل کاراکتر نام کاربری 2 عدد است")
    .max(255, "حداکثر کاراکتر نام کاربری 255 عدد است")
    .required("وارد کردن نام کاربری الزامیست"),
  password: yup
    .string()
    .required("وارد کردن پسورد الزامی است")
    .min(8, "حداقل 8 کاراکتر وارد کنید")
    .max(24, "حداکثر 24 کاراکتر وارد کنید"),
  uuid: yup.string().uuid().required("ارسال uuid اجباریست"),
  captcha: yup.string().required("وارد کردن کد کپچا اجباریست"),
});

module.exports = { registerSchema, loginSchema };

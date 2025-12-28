const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { User } = require("../db/models");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const body = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(body.Password, saltRounds);
  const newUser = await User.create({
    Id: body.Id,
    Password: hashedPassword,
    UserName: body.UserName,
    PhoneNumber: body.PhoneNumber,
    FullName: body.FullName,
    Email: body.Email,
  });
  if (!newUser) {
    return next(new AppError("Lỗi tạo người dùng", 400));
  }

  const result = newUser.toJSON();
  delete result.Password;
  result.token = generateToken({
    Id: result.Id,
  });
  return res.status(201).json({
    status: "success",
    message: "Tạo người dùng thành công",
    data: result,
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { UserName, Password } = req.body;
  if (!UserName || !Password) {
    return next(new AppError("Cung cấp đầy đủ tên đăng nhập và mật khẩu", 400));
  }
  const findUser = await User.findOne({
    where: { UserName },
  });
  if (!findUser || !(await bcrypt.compare(Password, findUser.Password))) {
    return next(
      new AppError("Tên đăng nhập hoặc mật khẩu không chính xác", 400)
    );
  }
  const result = findUser.toJSON();
  delete result.Password;
  const token = generateToken({
    Id: findUser.Id,
  });
  result.token = token;
  return res.json({
    status: "success",
    message: "Đăng nhập thành công",
    user: result,
  });
});

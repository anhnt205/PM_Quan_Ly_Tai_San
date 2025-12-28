const User = require("../db/models").User;
const checkLogin = catchAsync(async (req, res, next) => {
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }
  if (!idToken) {
    return next(new AppError("Please login to get access", 401));
  }
  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  const freshUser = await User.findByPk(tokenDetail.id);
  if (!freshUser) {
    return next(new AppError("User no longer exists", 400));
  }
  req.user = freshUser;
  return next();
});

module.exports = { checkLogin };

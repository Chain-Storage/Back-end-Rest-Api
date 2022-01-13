const User = require("../models/user.module");
const createSendToken = require("../utils/createJwtToken");

exports.signUp = async function (req, res, next) {
  const { password, passwordConfirm } = req.body;
  const newUser = await User.create({
    password,
    passwordConfirm,
  });

  createSendToken(newUser, 201, req, res);
};

exports.login = async (req, res, next) => {
  const { PrivateKey, password } = req.body;

  // 1) Check if email and password exist
  if (!PrivateKey || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ PrivateKey }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

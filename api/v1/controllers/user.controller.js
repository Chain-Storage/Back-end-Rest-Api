const User = require("../models/user.module");
const Storage = require("../models/storage.model");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const storage = await Storage.find({ coustemerId: req.user.id });

  if (!user) {
    return next(new AppError("you are not login", 404));
  }

  const userRoleDate = req.user.roleBuyDate;
  if (
    userRoleDate.year === userRoleDate.year + 1 &&
    userRoleDate.month === userRoleDate.month &&
    userRoleDate.day >= userRoleDate.day
  ) {
    await User.findByIdAndUpdate(req.user.id, {
      role: "standart",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      data: user,
      Storage: storage,
    },
  });
});

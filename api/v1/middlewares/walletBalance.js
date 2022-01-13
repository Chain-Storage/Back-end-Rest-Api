const catchAsync = require("../utils/catchAsync");
const Web3 = require("web3");
const User = require("../models/user.module");
const Storage = require("../models/storage.model");

exports.walletBalance = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const web3 = new Web3(
    new Web3.providers.HttpProvider(`${process.env.GANACHE_SERVER}`)
  );

  // Wallet Balance By ETH
  const balance = await web3.eth.getBalance(user.Address);

  user.WalletBalance = web3.utils.fromWei(balance);

  const storage = await Storage.find({ coustemerId: req.user.id }).select(
    "fileSizeAsMb"
  );

  const storageSizeArray = [];

  function name(data) {
    data.forEach(function (obj) {
      storageSizeArray.push(obj.fileSizeAsMb);
    });
  }

  name(storage);

  function getArraySum(a) {
    var total = 0;
    for (var i in a) {
      total += a[i];
    }
    return total;
  }

  const totalStorages = getArraySum(storageSizeArray);
  console.log(totalStorages);

  await User.findByIdAndUpdate(req.user.id, {
    WalletBalance: web3.utils.fromWei(balance),
    totalStorage: totalStorages,
  });
  next();
});

const catchAsync = require("../utils/catchAsync");
const Web3 = require("web3");
const User = require("../models/user.module");
const AppError = require("../utils/appError");

exports.sendTransaction = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const web3 = new Web3(
    new Web3.providers.HttpProvider(`${process.env.GANACHE_SERVER}`)
  );

  const transaction = {
    from: user.Address,
    to: req.body.to,
    value: web3.utils.toWei(req.body.ethValue, "ether"),
    gas: "53000",
  };

  if (req.body.ethValue > user.WalletBalance) {
    new AppError("You don't have enough balace", 404);
  }

  const transaciton = await web3.eth.accounts.signTransaction(
    transaction,
    user.PrivateKey
  );

  console.log(user.PrivateKey);

  const createReceipt = await web3.eth.sendSignedTransaction(
    transaciton.rawTransaction
  );

  console.log(`
   Money Transfer Succesful 
   from: ${user.Address},
   to: ${req.body.to},
   value: ${web3.utils.toWei(req.body.ethValue, "ether")}
   Transaction hash: ${createReceipt.transactionHash}
   Sended Succesfully
  `);

  res.status(200).json({
    status: "success",
    data: {
      sendData: createReceipt,
      userData: user,
    },
  });

  next();
});

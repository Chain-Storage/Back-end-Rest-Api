const Storage = require("../models/storage.model");
const catchAsync = require("./../utils/catchAsync");
const { Web3Storage, File } = require("web3.storage");
const AppError = require("../utils/appError");
const Web3 = require("web3");
const User = require("../models/user.module");

exports.sendFile = catchAsync(async (req, res, next) => {
  const token = process.env.WEB3STORAGE;
  const client = new Web3Storage({ token });
  const files = [new File([req.files.myFile.data], req.files.myFile.name)];

  const cid = await client.put(files);
  console.log(cid);

  const Sendres = await client.get(cid);
  const filesInfo = await Sendres.files();

  for (const file of filesInfo) {
    async function sendFile() {
      const fileSize = file.size / 1000000;
      const storage = await Storage.create({
        Userfile: file.name,
        coustemerId: req.user.id,
        fileSizeAsMb: fileSize,
        link: `https://${cid}.ipfs.dweb.link/${file.name}`,
      });

      res.status(200).json({
        status: "success",
        data: {
          storage,
        },
      });
    }

    const fileSize = file.size / 1000000;
    const totalStorageWithNewFile = +req.user.totalStorage + fileSize;

    if (req.user.role === "standart" && totalStorageWithNewFile < 1000) {
      sendFile();
      console.log("Standart User");
    } else if (req.user.role === "gold" && totalStorageWithNewFile < 50000) {
      sendFile();
      console.log("Golad User");
    } else if (
      req.user.role === "preminum" &&
      totalStorageWithNewFile < 1000000
    ) {
      sendFile();
      console.log("Perminum User");
    } else {
      console.log("File not Sended");
      res.status(201).json({
        status: "error",
        data: {
          message:
            "You can't upload this file because ypu don't have enoguh space",
        },
      });
    }
  }
});

async function buyNewRole(req, res, next, price, NewRole) {
  const goladPrice = price;
  const user = req.user;
  const adminWallet = process.env.ADMIN_WALLET;

  const currentYear = new Date();
  console.log(
    currentYear.getMonth() + 1,
    currentYear.getDate(),
    currentYear.getFullYear()
  );

  if (!user) {
    return next(new AppError("you are not login", 404));
  }

  if (
    goladPrice > user.WalletBalance &&
    req.body.PrivateKey === undefined &&
    req.body.Address === undefined
  ) {
    return next(new AppError("You don't have enough balace", 404));
  }

  if (user.role === NewRole) {
    return next(
      new AppError("You alredy have a gold or preminum account", 404)
    );
  }

  if (req.body.Address === undefined && req.body.PrivateKey === undefined) {
    req.body.Address = user.Address;
    req.body.PrivateKey = user.PrivateKey;
  }

  const web3 = new Web3(
    new Web3.providers.HttpProvider(`${process.env.GANACHE_SERVER}`)
  );

  const transaction = {
    from: req.body.Address,
    to: adminWallet,
    value: web3.utils.toWei(goladPrice, "ether"),
    gas: "21000",
  };

  const transaciton = await web3.eth.accounts.signTransaction(
    transaction,
    req.body.PrivateKey
  );

  const createReceipt = await web3.eth.sendSignedTransaction(
    transaciton.rawTransaction
  );

  console.log(`
   Money Transfer 
   from: ${req.body.Address},
   to: ${adminWallet},
   value: ${web3.utils.toWei(goladPrice, "ether")}
   Transaction hash: ${createReceipt.transactionHash}
   Sended Succesfully
  `);

  const updateUser = await User.findByIdAndUpdate(req.user.id, {
    role: NewRole,
    roleBuyDate: {
      year: Number(currentYear.getFullYear()),
      month: Number(currentYear.getMonth() + 1),
      day: Number(currentYear.getDate()),
    },
  });

  if (!updateUser) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      updateUser,
      createReceipt,
    },
  });
}

exports.buyGbGold = catchAsync(async (req, res, next) => {
  buyNewRole(req, res, next, "0.007", "gold");
});

exports.buyGbPreminum = catchAsync(async (req, res, next) => {
  buyNewRole(req, res, next, "0.05", "preminum");
});

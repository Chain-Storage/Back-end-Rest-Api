const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Web3 = require("web3");

const userSchema = mongoose.Schema({
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  Address: {
    type: String,
  },
  PrivateKey: {
    type: String,
  },
  WalletBalance: {
    type: String,
  },
  totalStorage: {
    type: String,
  },
  role: {
    type: String,
    enum: ["standart", "gold", "preminum"],
    default: "standart",
  },
  roleBuyDate: {
    year: Number,
    month: Number,
    day: Number,
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(`${process.env.GANACHE_SERVER}`)
  );
  // Create ETC-20 Keys
  const addEtc20Key = web3.eth.accounts.create();
  // Test On Console
  web3.eth.getAccounts().then(console.log);
  console.log(addEtc20Key);

  // Paste the Mongoose Schema
  this.Address = addEtc20Key.address;
  this.PrivateKey = addEtc20Key.privateKey;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

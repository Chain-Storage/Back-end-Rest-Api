const mongoose = require("mongoose");
const Web3 = require("web3");

const storageSchema = mongoose.Schema({
  Userfile: {
    type: String,
  },
  link: [String],
  fileSizeAsMb: {
    type: Number,
  },
  coustemerId: { type: String },
});

const Storage = mongoose.model("Storage", storageSchema);

module.exports = Storage;

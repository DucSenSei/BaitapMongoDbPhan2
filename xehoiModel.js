const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const xehoiModels = new Schema({
    Ten: String,
    Nam: Number,
    GiaBan: Number,
  }
  );
module.exports = mongoose.model("xehoiModel",xehoiModels);
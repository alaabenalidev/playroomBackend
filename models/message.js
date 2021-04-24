const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema({
  msgFrom: { type: mongoose.Schema.Types.ObjectId, default: "", required: true },
  msg: String,
},
{
  timestamps: true
});

mongoose.model("Messages", chatSchema);
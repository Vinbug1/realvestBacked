const mongoose = require("mongoose");

const investmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  intention_at: {
    type: Date,
    default: Date.now,
  },
  payment_at: {
    type: Date,
    default: Date.now,
  },
  confirmed_at: {
    type: Date,
    default: Date.now,
  },
  request_close_at: {
    type: Date,
    default: Date.now,
  },
  closed_at: {
    type: Date,
    default: Date.now,
  },
  amount_paid: {
    type: Number,
  },
  invstatus: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  interest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interest",
    required: true,
  },
});

investmentSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  const { _id: id, ...result } = object;
  return { ...result, id };
});

exports.Investment = mongoose.model("Investment", investmentSchema);

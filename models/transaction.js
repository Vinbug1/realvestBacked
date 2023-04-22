const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount_paid: {
    type: Number,
    required: true,
  },
  trxref: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  trans: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Investment",
    required: true,
  },
});

transactionSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  const { _id: id, ...result } = object;
  return { ...result, id };
});

exports.Transaction = mongoose.model("Transaction", transactionSchema);

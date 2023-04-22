const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
  amount_paid: {
    type: Number,
    required: true,
  },
  instructed_at: {
    type: Date,
    default: Date.now,
  },
  paid_at: {
    type: Date,
    default: Date.now,
  },
});
interestSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  const { _id: id, ...result } = object;
  return { ...result, id };
});

exports.Interest = mongoose.model("Interest", interestSchema);

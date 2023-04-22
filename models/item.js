const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  total_amount: {
    type: Number,
    default: 0,
  },
  interest_rate: {
    type: Number,
    default: 0,
  },
  circle: {
    type: String,
    required: true,
  },
  chasis: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});
itemSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  const { _id: id, ...result } = object;
  return { ...result, id };
});

exports.Item = mongoose.model("Item", itemSchema);

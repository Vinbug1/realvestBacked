const mongoose = require("mongoose");

const repairSchema = mongoose.Schema({
  name: {
    type: String,
    allowNull: false,
    unique: true,
  },
  description: {
    type: String,
    allowNull: false,
  },
  estimated_amount: {
    type: Number,
    allowNull: false,
  },
  expended_amount: {
    type: Number,
    allowNull: false,
  },
  started_at: {
    type: Date,
    allowNull: false,
  },
  completed_at: {
    type: Date,
    allowNull: false,
  },
});
repairSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  const { _id: id, ...result } = object;
  return { ...result, id };
});

exports.Repair = mongoose.model("Repair", repairSchema);

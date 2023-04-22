const mongoose = require("mongoose");

const maintenanceSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  estimated_amount: {
    type: Number,
    required: true,
  },
  expended_amount: {
    type: Number,
    required: true,
  },
  started_at: {
    type: Date,
    default: Date.now,
  },
  completed_at: {
    type: Date,
    default: Date.now,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
});
maintenanceSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  const { _id: id, ...result } = object;
  return { ...result, id };
});

exports.Maintenance = mongoose.model("Maintanence", maintenanceSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  // dob: {
  //   type: Date,
  //   required: true,
  // },
  gender: {
    type: String,
    required: true,
    //type: DataTypes.ENUM('man', 'woman'),
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  // pin: {
  //   type: String,
  //   required: true,
  // },
  address: {
    type: String,
    required: true,
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;

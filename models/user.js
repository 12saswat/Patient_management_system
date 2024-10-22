const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["doctor", "receptionist"],
    default: "receptionist",
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema);

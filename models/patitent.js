const { default: mongoose } = require("mongoose");

const patientScema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
  },
  DOB: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  emergencyContact: {
    type: String,
  },
  medicalHistory: {
    type: String,
  },
  Status: {
    type: String,
  },
});

module.exports = mongoose.model("patient", patientScema);

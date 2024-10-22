const express = require("express");
const User = require("./models/user");
const { default: mongoose } = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("./models/patitent");
const { checkRole } = require("./middleWare/checkrole");
require("dotenv").config();

const port = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("> mongoDb connected successfully....");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Registeration route for doctor and reciptionnist
app.post("/api/register", async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const hashPass = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    email,
    password: hashPass,
    role,
  });

  try {
    await newUser.save();
    res.json({ user: newUser, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//Login route for doctor and receptionist
app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    // Check if the password is correct
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).send("Invalid credentials");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.SECREATE_KEY
    );

    return res.status(200).json({ token, message: "User login successfully" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//register a patient
app.post(
  "/api/patient/register",
  checkRole("receptionist"),
  async (req, res) => {
    // Check if the user is a receptionist
    if (User.role == "receptionist") {
      const {
        name,
        phoneNo,
        DOB,
        gender,
        address,
        emergencyContact,
        medicalHistory,
        Status,
      } = req.body;

      // Check if the patient is already registered
      const existingPatient = await Patient.findOne({ phoneNo });
      if (existingPatient) {
        return res.status(400).send("Patient is already registered.");
      }

      // Create a new patient
      const newPatient = new Patient({
        name,
        phoneNo,
        DOB,
        gender,
        address,
        emergencyContact,
        medicalHistory,
        Status,
      });

      try {
        await newPatient.save();
        // Generate a JWT token
        const token = jwt.sign(
          { email: email, role: role },
          process.env.SECREATE_KEY
        );

        return res.status(200).send({
          token,
          newPatient,
          message: "Patient registered successfully",
        });
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
    } else {
      const {
        name,
        phoneNo,
        DOB,
        gender,
        address,
        emergencyContact,
        medicalHistory,
        Status,
      } = req.body;

      // Check if the patient is already registered
      const existingPatient = await Patient.findOne({ phoneNo });
      if (existingPatient) {
        return res.status(400).send("Patient is already registered.");
      }

      // Create a new patient
      const newPatient = new Patient({
        name,
        phoneNo,
        DOB,
        gender,
        address,
        emergencyContact,
        medicalHistory,
        Status,
      });

      try {
        await newPatient.save();

        return res.status(200).send({
          newPatient,
          message: "Patient registered successfully",
        });
      } catch (err) {
        res.status(500).json({ error: "Server error" });
      }
    }
  }
);

//delete a patient
app.delete("/api/patient/:id", checkRole("receptionist"), async (req, res) => {
  const id = req.params.id;
  try {
    await Patient.findByIdAndDelete(id);

    res.status(201).send("patient deleted");
  } catch (err) {
    res.send("User not deleted");
  }
});

//to get the patient by their id
app.get("/api/patient/:id", checkRole("receptionist"), async (req, res) => {
  const id = req.params.id;
  const patient = await Patient.findById(id);
  res.status(200).send(patient);
});

//To update the patient reciptionist
app.post(
  "/api/patient/update/:id",
  checkRole("receptionist"),
  async (req, res) => {
    const {
      name,
      phoneNo,
      DOB,
      gender,
      address,
      emergencyContact,
      medicalHistory,
      Status,
    } = req.body;
    try {
      const updatePatient = await Patient.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          phoneNo,
          DOB,
          gender,
          address,
          emergencyContact,
          medicalHistory,
          Status,
        },
        { new: true }
      );
      return res.status(200).json(updatePatient);
    } catch (err) {
      console.log(err);
      res.status(404).json({ error: "Internal Server Error" });
    }
  }
);

//Doctor updateion route patient
app.post("/api/patient/update/:id", checkRole("doctor"), async (req, res) => {
  const {
    name,
    phoneNo,
    DOB,
    gender,
    address,
    emergencyContact,
    medicalHistory,
    Status,
  } = req.body;
  try {
    const updatePatient = await Patient.findOneAndUpdate(
      { _id: req.params.id },
      {
        name,
        phoneNo,
        DOB,
        gender,
        address,
        emergencyContact,
        medicalHistory,
        Status,
      },
      { new: true }
    );
    return res.status(200).json(updatePatient);
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);

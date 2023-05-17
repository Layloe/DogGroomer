const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function() {
  console.log("Successfully connected to MongoDB");
});

const formDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  notes: {
    type: String
  }
});



const FormData = mongoose.model("FormData", formDataSchema);

app.post("/form", async (req, res) => {
  const formData = new FormData(req.body);

  console.log("formData:", formData);

  try {
    await formData.save();
    res.status(201).send("Form data submitted successfully");
  } catch (error) {
    console.log("Error submitting form data:", error);
    res.status(500).send("Error submitting form data");
  }
});

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"))
})

// app.get('/form', (req,res) => {
//   return res.send('pong')
// })

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

const reactPort = 8000
const apiPort = process.env.PORT || 8001


app.listen(apiPort, () => {
  console.log(`API server listening on port ${apiPort}`);
});

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 5000;
const router = require("express").Router();
const Problem = require("./models/Problems");
const { generateFile } = require("./generateFile");
const Job = require("./models/Job.js");
const cookieParser = require("cookie-parser");
const AddProblems = require("./routes/AddProblemRoutes");
const GetProblems = require("./routes/GetproblemsRoute");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoute");
const fileUpload = require("express-fileupload");
const { addJobToQueu } = require("./jobQueue");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());

mongoose.connect("mongodb://localhost:27017/Online-compiler", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//routes

app.get("*", checkUser);
app.get("/", requireAuth, (req, res) => res.send("hii"));
app.use(authRoutes);

app.get("/", (req, res) => {
  res.send("Hii");
});

app.get("/status", async (req, res) => {
  const jobId = req.query.id;

  if (jobId == undefined) {
    res.status(400).json({ success: false, msg: "Id is not given" });
  }

  try {
    const job = await Job.findById(jobId);

    if (job == undefined) {
      res.status(400).json({ success: false, msg: "Invalid id" });
    }

    res.status(210).json({ success: true, msg: "Valid response", job });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "err" });
  }
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code, userInput } = req.body;
  console.log("input",userInput);
  // if (!req.files || !req.files.file) {
  //     return res.status(400).json({ error: 'No file uploaded' });
  //   }
  // const selectedFile = req.files.file;

  // console.log('Uploaded file name:', selectedFile.name);
  // console.log('Uploaded file size:', selectedFile.size);
  // console.log('Selected File MIME Type:', selectedFile.mimetype);
  // // If you want to see the content of the file as a Buffer
  // console.log('Selected File Data:', selectedFile.data.toString());

//   console.log(language, code.length);

  if (code === undefined || !code) {
    return res.status(400).json({ success: false, error: "Code is not given" });
  }

  let job;

  try {
    const filePath = await generateFile(language, code);

    job = await new Job({ language, filePath, userInput }).save();
    const jobId = job["_id"];
    addJobToQueu(jobId);
    res.status(201).json({ success: true, jobId });
  } catch (err) {
    return res.status(400).json({ success: false, err: JSON.stringify(err) });
  }
});
app.use(AddProblems);
app.use(GetProblems);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

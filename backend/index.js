const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require('cors');
const app = express()
const port = 5000
const router = require("express").Router();
const Problem = require("./models/Problems");
const {generateFile} = require('./generateFile');
const {executeCpp} = require('./executeCpp')
const {executePython} = require('./executePython')
const Job = require('./models/Job.js');
const cookieParser = require('cookie-parser');
const AddProblems = require('./routes/AddProblemRoutes')
const GetProblems = require('./routes/GetproblemsRoute')
const {requireAuth,checkUser} = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoute')

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())
app.use(cors());


mongoose.connect("mongodb://localhost:27017/Online-compiler", {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});


//routes

app.get('*',checkUser)
app.get('/',requireAuth,(req,res) => res.send('hii'));
app.use(authRoutes);

app.get('/',(req,res)=>{
    res.send("Hii")
})

app.get('/status', async (req,res)=>{
    const jobId = req.query.id;

    if(jobId == undefined)
    {
        res.status(400).json({success:false,msg:"Id is not given"});
    }

    try{
        const job = await Job.findById(jobId);

        if(job==undefined)
        {
            res.status(400).json({success:false,msg:"Invalid id"});
        }

        res.status(210).json({success:true,msg:"Valid response",job});

    }catch(err)
    {
        console.log(err);
        res.status(400).json({success:false,msg:"err"});
    }
})

app.post('/run',async (req,res)=>{

    const {language="cpp",code} = req.body;
    console.log(language,code.length);

    if(code===undefined)
    {
        return res.status(400).json({success:false, error:"Code is not given"});
    }

    let output,job;

    try{
        const filePath = await generateFile(language,code);

        job =  await new Job({language,filePath}).save();
        console.log(job);

        const jobId = job["_id"];
        res.status(201).json({success:true,jobId});

        job["startedAt"] = Date.now();
        if(language==="cpp")
        {
            output =  await executeCpp(filePath);
            console.log({filePath,output});
        }
        else if(language==="py") output = await executePython(filePath); 
        // return res.json({filePath,output});
        console.log({filePath,output});
        console.log(job);
        job["completedAt"] = Date.now();        
        job["output"] = output;
        job["status"] = "success";
        await job.save();
        console.log(job);
    }
    catch(err)
    {
        job["completedAt"] = Date.now();
        job["output"] = output;
        job["status"] = "error";
        await job.save();
        console.log(job);
        // res.status(500).json({ err });
        console.log(err);
    }
})
app.use(AddProblems);
app.use(GetProblems);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
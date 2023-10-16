const Problem = require("../models/Problems");

const AddProblems = ("/add", async(req,res)=>{
const {slug,title,difficulty,description,inputFormat,constraint} = req.body;
console.log("backend",req.body);
    let newProblem;

    try{
         newProblem = await new Problem ({slug,title,difficulty,description,inputFormat,constraint}).save();
         console.log("new Problem added",newProblem);
         res.status(201).json({success:true,newProblem});
    }
    catch(err){
        console.log(err);
        return res.status(402).json(err);
    }
});

module.exports = {
    AddProblems
}
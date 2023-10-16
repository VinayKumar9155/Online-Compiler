const problems = require('../models/Problems');

const GetProblems = ('/problems',async(req,res)=>{
    const AllProblems = await problems.find();
    console.log("problems",AllProblems);
    res.status(201).json(AllProblems);
})

module.exports = {
   GetProblems
}
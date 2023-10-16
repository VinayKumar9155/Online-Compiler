const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProblemSchema = new Schema ({
    slug:{
        type:String,
        // required:true,
    },
    title :{
        type:String,
        // required:true,
    },
    difficulty:{
        type:String,
        // required:true,
    },
    description:{
        type:String,
        // required:true
    },
    inputFormat:{
        type:String,
        // required:true
    },
    constraint:{
        type:String,
        // required:true
    },

    input:{
        type:String
    },
    output:{
        type:String
    },
    testcase: [
        {
          input: { type: String },
          output: { type: String },
        },
      ],
})

const Problem = mongoose.model("problem",ProblemSchema);

module.exports = Problem;
// const path = require('path');
// const fs = require('fs');
// const {exec} = require('child_process');
// const outputPath = path.join(__dirname,"output");

// if(!fs.existsSync(outputPath))
// {
//     fs.mkdirSync(outputPath,{recursive:true});
// }

// const execCode = async (filePath)=>{

//      const jobId = path.basename(filePath).split(".")[0];
//      const outPath = path.join(outputPath,`${jobId}.out`);

//     //  console.log("jd",`g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`);
    

//      return new Promise( (resolve,reject)=>
//      {
//         exec(
//          `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`
//         ,(error,stderr,stdout)=>{
//         if(error){
//             reject({error,stderr});
//         }
//         if(stderr){
//             reject(stderr)
//         }
//         resolve(stdout)
//      })

//      })

//      console.log("jd",`g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`);
// }

// module.exports = {
//     execCode
// }




const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    exec(
    `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}.out`,

      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executeCpp,
};

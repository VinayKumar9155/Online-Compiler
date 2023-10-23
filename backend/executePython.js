// const { exec } = require("child_process");

// const executePython = (filepath) => {
//   return new Promise((resolve, reject) => {
//     exec(
//     `python ${filepath}`,

//       (error, stdout, stderr) => {
//         error && reject({ error, stderr });
//         stderr && reject(stderr);
//         resolve(stdout);
//       }
//     );
//   });
// };

// module.exports = {
//   executePython,
// };


// Modified code after taking input form user.

const { execSync } = require("child_process");
const path = require("path");

const executePython = (filepath, userInput) => {
  const pythonPath = "C:/Users/vinay/AppData/Local/Programs/Python/Python311/python";
  try {
    const child = execSync(`${pythonPath} ${filepath}`, { input: userInput, encoding: "utf8" });
    return child.toString();
  } catch (error) {
    // If an error occurs, capture the error message from stderr
    return error.stderr.toString();
  }
};

module.exports = {
  executePython,
};


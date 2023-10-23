// const { execSync } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const outputPath = path.join(__dirname, "outputs");

// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath, { recursive: true });
// }

// const executeCpp = (filepath,userInput) => {
//   const jobId = path.basename(filepath).split(".")[0];
//   const outPath = path.join(outputPath, `${jobId}.out`);

//   return new Promise((resolve, reject) => {
//     exec(
//     `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}.out`,

//       (error, stdout, stderr) => {
//         error && reject({ error, stderr });
//         stderr && reject(stderr);
//         resolve(stdout);
//       }
//     );
//   });
// };

// module.exports = {
//   executeCpp,
// };


// Modified code after taking input form user.

// const { execSync } = require("child_process");
// const fs = require("fs");
// const path = require("path");
// const os = require("os");

// const outputPath = path.join(__dirname, "outputs");

// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath, { recursive: true });
// }

// const executeCpp = (filepath, userInput) => {
//   const jobId = path.basename(filepath).split(".")[0];
//   const outPath = path.join(outputPath, `${jobId}.out`);

//   try {
//     // Compile the C++ source file
//     execSync(`g++ ${filepath} -o ${outPath}`, { stdio: "inherit" });

//     // Run the compiled binary based on the operating system
//     let child;
//     if (os.platform() === "win32") {
//       child = execSync(`${outPath}`, {
//         input: userInput,
//         stdio: "pipe", // Use "pipe" to capture output
//       });
//     } else {
//       child = execSync(`./${jobId}.out`, {
//         input: userInput,
//         stdio: "pipe", // Use "pipe" to capture output
//       });
//     }

//     return child.toString();
//   } catch (error) {
//     return error.message; // Return the error message
//   }
// };

// module.exports = {
//   executeCpp,
// };



const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, userInput) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  try {
    // Compile the C++ source file and capture both stdout and stderr
    const compileCommand = `g++ ${filepath} -o ${outPath} 2>&1`;
    const childCompile = execSync(compileCommand, {
      input: userInput,
      stdio: "pipe",
    });

    // Execute the compiled binary based on the operating system and capture its stdout
    let childExecute;
    if (os.platform() === "win32") {
      // Check if running on Windows and skip WSL-related error messages
      if (childCompile.toString().includes("Windows Subsystem for Linux has no installed distributions")) {
        return "Compilation error: Windows Subsystem for Linux is not configured.";
      }
      childExecute = execSync(`${outPath}`, {
        input: userInput,
        stdio: "pipe",
      });
    } else {
      childExecute = execSync(`./${jobId}.out`, {
        input: userInput,
        stdio: "pipe",
      });
    }

    const compilationOutput = removeFilePathFromError(childCompile.toString());
    const executionOutput = childExecute.toString();

    // Combine the compilation and execution outputs into a single string
    const combinedOutput = `${compilationOutput}\n${executionOutput}`;

    return combinedOutput;
  } catch (error) {
    // If compilation failed, capture the error message and remove the path
    return removeFilePathFromError(error.stdout.toString());
  }
};

function removeFilePathFromError(errorOutput) {
  // Use a regular expression to remove file paths from the error message
  const pathRemovedError = errorOutput.replace(/\S+\:\S+\:\S+\:\S+\:/g, '');
  return pathRemovedError.trim();
}

module.exports = {
  executeCpp,
};

const { spawn } = require("child_process");
const fs = require("fs");

module.exports = function mergeVideos(videoPaths, outputFilePath) {
  return new Promise((resolve, reject) => {
    // Create a string with the paths of all input videos separated by '|'
    const inputList = videoPaths.map((path) => `file ${path}`).join("\n");

    console.log(inputList);
    // Write the input list to a temporary text file
    const listFilePath = "./input_list.txt";
    fs.writeFileSync(listFilePath, inputList);

    // Construct the FFmpeg command

    const ffmpegCommand = [
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listFilePath,
      "-c",
      "copy",
      outputFilePath,
    ];

    // Spawn FFmpeg process
    const ffmpegProcess = spawn("ffmpeg", ffmpegCommand);

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
    // Handle process events
    ffmpegProcess.on("exit", (code) => {
      if (code === 0) {
        console.log("Videos merged successfully");
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpegProcess.on("error", (err) => {
      reject(err);
    });
  });
};

// Example usage
// let videoPaths = [];
// const outputFilePath = "./content/main.mp4";
// let videocount = 14;
// let i = 0;

// while (i < videocount) {
//   videoPaths.push(`video/video${i}.mp4`);
//   i++;
// }

// mergeVideos(videoPaths, outputFilePath)
//   .then(() => {
//     console.log("Video merge complete");
//   })
//   .catch((err) => {
//     console.error("Error merging videos:", err);
//   });

//
//
//
//
//
//
// const ffmpegArgs = [
//   "-i",
//   video1Path,
//   "-i",
//   video2Path,
//   "-filter_complex",
//   "[0:v:0][1:v:0]concat=n=2:v=1:a=0[outv]",
//   "-map",
//   "[outv]",
//   tempFilePath,
//   "-y",
// ];

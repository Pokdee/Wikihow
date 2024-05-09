////
const { spawn } = require("child_process");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

module.exports = async function audioMerger(image, audio, output) {
  const ffmpegArgs = [
    "-loop",
    "1",
    "-i",
    image,
    "-i",
    audio,
    "-vf",
    "scale=1280:720",
    "-c:v",
    "libx264",
    "-tune",
    "stillimage",
    "-c:a",
    "aac",
    "-strict",
    "experimental",
    "-b:a",
    "192k",
    "-shortest",
    output,
  ];

  // Spawn FFmpeg process
  const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

  // // Log FFmpeg output
  // ffmpegProcess.stdout.on("data", (data) => {
  //   // console.log(`stdout: ${data}`);
  // });

  // ffmpegProcess.stderr.on("data", (data) => {
  //   // console.error(`stderr: ${data}`);
  // });

  // Handle FFmpeg process exit
  ffmpegProcess.on("close", (code) => {
    if (code === 0) console.log("video not error");
    console.log(`child process exited with code ${code}`);
  });
};

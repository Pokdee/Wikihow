const imagePath = "./image/image0.jpg";
const audioPath = "./audio/speech0.mp3";
const outputPath = "./video/test.mp4";

////
const { spawn } = require("child_process");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
// Create ffmpeg command
//
//
//
//

// FFmpeg command arguments

module.exports = function merger(image, audio, output, type = "audio") {
  const ffmpegArgs = [
    "-loop",
    "1",
    "-i",
    imagePath, // Loop the image to create a video
    "-i",
    audioPath,
    "-c:v",
    "libx264", // Video codec
    "-tune",
    "stillimage",
    "-c:a",
    "aac", // Audio codec
    "-b:a",
    "192k", // Audio bitrate
    "-pix_fmt",
    "yuv420p", // Pixel format
    "-shortest", // Stop encoding when the shortest input stream ends
    outputPath,
  ];

  // Spawn FFmpeg process
  const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

  // Log FFmpeg output
  ffmpegProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpegProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // Handle FFmpeg process exit
  ffmpegProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

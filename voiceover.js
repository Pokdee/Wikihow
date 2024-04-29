import fs from "fs";
import OpenAI from "openai";
import path from "path";

// const { fs } = require("fs");
// const { OpenAI } = require("openai");
// const { path } = require("path");
// ///

const openai = new OpenAI();

const main = async function main() {
  let script = fs.readFileSync("data.txt", "utf8");

  let stepsArray = script.split(/[0-9]\n/g);

  console.log(stepsArray.length);

  let num = 0;

  for (let i = 0; i < stepsArray.length; i++) {
    let step = stepsArray[i];

    step = step.replace(/\[\d\]/g, "");

    let audioFile = path.resolve(`./speech${num}.mp3`);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: `${step}`,
      language: "English",
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(audioFile, buffer);

    num = num + 1;
  }
};

main();

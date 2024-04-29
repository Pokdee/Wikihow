const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const openai = new OpenAI();

const speechFile = path.resolve("./speech.mp3");

module.exports = async function speech(text) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: text,
    speed: "1.1",
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
};

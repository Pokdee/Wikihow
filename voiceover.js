const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const timer = (ms) => new Promise((r) => setTimeout(r, ms));

const openai = new OpenAI();

module.exports = async function speech(text, path) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: text,
    speed: "1.0",
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(path, buffer);
};

const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const speech = require("./voiceover.js");
const { isArray } = require("core-util-is");
const merger = require("./ffmpeg.js");

////
let url = "https://www.wikihow.com/";

//timer
const timer = (ms) => new Promise((r) => setTimeout(r, ms));

// data
let data = {};
data.main = {};

//

(async () => {
  //detail Selector

  const titleSelector = "#section_0 > a";
  const introSelector = ".mf-section-0";
  const stepTitleSelector = ".whb";
  const stepSelector = ".step";
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: { width: 1920, height: 1080 },
  });
  let page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "load",
  });

  //Check Popular/////////////////////////////////

  //Popular selector
  let popularSelect = "div#hp_popular_container > div.hp_thumb";

  //get banner popular content //////////////////////////////////////////

  /*
  const popularImgSrc = await page.evaluate(() => {
    const imgs = Array.from(
      document.querySelectorAll(
        "div#hp_popular_container > div.hp_thumb > a > div.content-spacer > img"
      )
    );
    return imgs.map((img) => img.src);
  });

  const mainImgUrl = popularImgSrc[1];
  const viewSource = await page.goto(mainImgUrl);
  const buffer = await viewSource.buffer();

  // Save the image

  fs.writeFileSync(`./image/image0.jpg`, buffer);
  console.log("save banner");

  await page.goBack();
*/
  //get url popular content

  const popularUrl = await page.evaluate(() => {
    let links = Array.from(
      document.querySelectorAll("div#hp_popular_container > div.hp_thumb > a")
    );
    return links.map((link) => link.getAttribute("href"));
  });

  const trending = await page.$$("div#hp_popular_container > div.hp_thumb > a");

  await trending[1].click();

  //wait for data to load ///////////////////////////////////////////
  await page.waitForSelector(".mf-section-0");
  await page.waitForSelector(".whb");
  await page.waitForSelector(".step");

  console.log("wait done");
  ////get Title ////////////////////////////////
  let title = await page.$(titleSelector);
  const titleText = await title.evaluate((el) => el.textContent.trim());

  data.main.title = titleText;
  console.log("got title");

  ////get Intro ///////////////////////////////

  let intro = await page.$(introSelector);
  const introText = await intro.evaluate((el) => el.textContent);

  data.main.intro = introText.replace(/[\r\n]+/g, "");
  console.log("got intro");

  //voiceover
  let speechFile = path.resolve(`./audio/speech${0}.mp3`);
  await speech(data.main.title + data.main.intro, speechFile);
  await timer(60000);
  console.log("intro done");

  //////get Images /////////////////////////////////////////
  /*
  const imagesUrl = await page.evaluate(() => {
    let images = Array.from(document.querySelectorAll("img.whcdn")); // Change 'img' to the appropriate CSS selector for the image you want to download
    return images.map((img) => img.src);
  });

  //use for loop through all images

  for (let i = 0; i < imagesUrl.length; i++) {
    const url = imagesUrl[i];
    const viewSource = await page.goto(url);
    const buffer = await viewSource.buffer();

    // Save the image
    fs.writeFileSync(`./image/image${i+1}.jpg`, buffer);
    //wait some time for page to load
    await timer(2000);
    await page.goBack();
  }
  console.log("saved all image");
 */
  /////////////

  // // get STeps ///////////////////////////////////////////

  const elementArray = await page.$$(".step");
  let stepsText = [];

  for (let i = 0; i < elementArray.length; i++) {
    const element = elementArray[i];

    // Execute JavaScript within the page context to get child nodes
    const childNodes = await page.evaluate((element) => {
      return Array.from(element.childNodes).map((node) => {
        return {
          content: node.textContent,
        };
      });
    }, element);

    /////get all the steps

    let step = {
      title: childNodes[1].content,
      step: childNodes[2].content ? childNodes[2].content : "",
    };
    // stepsText.push(step);

    let speechFile = path.resolve(`./audio/speech${i + 1}.mp3`);
    await speech(step.title + step.step, speechFile);
    await timer(60000);
    console.log("step", i + 1, "done");
  }

  // data.steps = stepsText;

  console.log("got steps");

  ///content organiser and voiceover ///////////////////////////////
  // let speechFile = path.resolve(`./audio/speech${0}.mp3`);
  // const dataArray = Object.values(data);
  // for (let i = 0; i < dataArray.length; i++) {
  //   let val = dataArray[i];

  //   if (!isArray(val)) {
  //     // speech(val.title + val.intro, speechFile);
  //     console.log(val);
  //     await timer(30000);
  //     console.log(1, "in");
  //   }

  //   if (isArray(val)) {
  //     val.forEach(async (step, i) => {
  //       let title = step.title;
  //       let context = step.step;
  //       console.log("title", title);
  //       console.log("step", context);
  //       await timer(30000);
  //       console.log(i + 2, "in");
  //       // speechFile = path.resolve(`./audio/speech${i + 1}.mp3`);
  //       // speech(title + context, speechFile);
  //     });
  //   }
  // }

  ////merge audio and video one by one

  ///merge all to make one video
  console.log("All done");
})();

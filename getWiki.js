const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const { title } = require("process");
let url = "https://www.wikihow.com/";

//timer
const timer = function (t, val) {
  return new Promise((resolve) => setTimeout(resolve, t, val));
};

// data
let data = {};

//
(async () => {
  //detail Selector
  const titleSelector = "#section_0";
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

  let popularSelect = "div#hp_popular_container > div.hp_thumb";

  const popular = await page.evaluate(() => {
    return document
      .querySelector("div#hp_popular_container > div.hp_thumb > a")
      .getAttribute("href");
  });

  console.log(popular);
  await page.goto(url + popular);

  /*

  //wait for data to load
  await page.waitForSelector(".mf-section-0");
  await page.waitForSelector(".whb");
  await page.waitForSelector(".step");

  ////get Title
  let title = await page.$(titleSelector);
  const titleText = await title.evaluate((el) => el.textContent);
  data.title = titleText;

  ////get Intro
  let intro = await page.$(introSelector);
  const introText = await intro.evaluate((el) => el.textContent);

  data.intro = introText.replace(/[\r\n]+/g, "");

  // get Images
  
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
    fs.writeFileSync(`./image/image${i}.jpg`, buffer);
    console.log("save");
    //wait some time for page to load
    await timer(2000);
    await page.goBack();
  }
  

  /////////////

  // // get STeps

  const elementArray = await page.$$(".step");
  let stepsText = [];

  for (let i = 0; i < elementArray.length; i++) {
    const element = elementArray[i];

    // Execute JavaScript within the page context to get child nodes
    const childNodes = await page.evaluate((element) => {
      return Array.from(element.childNodes).map((node) => {
        return {
          content: node.textContent.trim(),
        };
      });
    }, element);

    ///get all the steps
    let step = {
      title: childNodes[1].content,
      step: `${childNodes[2].content ? childNodes[2].content : ""} ${
        childNodes[5] ? childNodes[5].content.replace(/[\r\n]+/g, "!  ") : ""
      }`,
    };
    stepsText.push(step);
  }

  data.steps = stepsText;

  console.log(data);
  */
})();
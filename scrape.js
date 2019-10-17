const puppeteer = require('puppeteer');

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://books.toscrape.com/');
  await page.waitFor(1000);
};

scrape().then(value => {
  console.log(value);
});

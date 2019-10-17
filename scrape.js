const puppeteer = require('puppeteer');

let scrapeBooks = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://books.toscrape.com/');
  await page.waitFor(1000);

  let nextButton = await page.evaluate(() => {
    let button = document.getElementsByClassName('next')[0];
    let buttonLink = button.getElementsByTagName('a')[0].href;
    return buttonLink;
  });

  let allBookLinks = await page.evaluate(() => {
    let books = document.getElementsByClassName('image_container');
    let booksArray = [...books];
    let bookLinks = booksArray.map(book => {
      return book.firstElementChild.href;
    });
    return bookLinks;
  });

  for (let i = 0; i < allBookLinks.length; i++) {
    let singleBookLink = allBookLinks[i];
    await page.goto(singleBookLink);
    const singleBookInfo = await page.evaluate(() => {
      const genre = document
        .getElementsByClassName('breadcrumb')[0]
        .getElementsByTagName('li')[2].innerText;

      const title = document.getElementsByTagName('h1')[0].innerText;
      const rating = document.getElementsByTagName('p')[2].className;
      const price = document.getElementsByClassName('price_color')[0].innerText;
      const availability = document.getElementsByClassName(
        'instock availability'
      )[0].innerText;
      const productDescription = document.getElementsByTagName('p')[3]
        .innerText;

      console.log(rating);
    });
    await page.waitFor(1000);
  }

  await page.goto(nextButton);

  // browser.close();
};

scrapeBooks().then(value => {
  console.log(value);
});

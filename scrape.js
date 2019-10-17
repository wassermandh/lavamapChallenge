const puppeteer = require('puppeteer');

let scrapeBooks = async () => {
  let allBookInfo = [];
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://books.toscrape.com');
  await page.waitFor(1000);

  let allBookLinks = await page.evaluate(() => {
    let books = document.getElementsByClassName('image_container');
    let booksArray = [...books];
    let bookLinks = booksArray.map(book => {
      return book.firstElementChild.href;
    });
    return bookLinks;
  });

  let nextButton = await page.evaluate(() => {
    let button = document.getElementsByClassName('next')[0];
    let buttonLink = button.getElementsByTagName('a')[0].href;
    return buttonLink;
  });

  while (true) {
    for (let i = 0; i < allBookLinks.length; i++) {
      let singleBookLink = allBookLinks[i];
      await page.goto(singleBookLink);

      const singleBookInfo = await page.evaluate(() => {
        const genre = document
          .getElementsByClassName('breadcrumb')[0]
          .getElementsByTagName('li')[2].innerText;

        const title = document.getElementsByTagName('h1')[0].innerText;
        const rating = document.getElementsByTagName('p')[2].className;
        const price = document.getElementsByClassName('price_color')[0]
          .innerText;
        const availability = document.getElementsByClassName(
          'instock availability'
        )[0].innerText;
        const UPC = document.getElementsByTagName('td')[0].innerText;
        const productDescription = document.getElementsByTagName('p')[3]
          .innerText;
        const productType = document.getElementsByTagName('td')[1].innerText;
        const priceExclTax = document.getElementsByTagName('td')[2].innerText;
        const priceInclTax = document.getElementsByTagName('td')[3].innerText;
        const tax = document.getElementsByTagName('td')[4].innerText;
        const numOfReviews = document.getElementsByTagName('td')[6].innerText;

        return {
          genre,
          title,
          rating,
          price,
          availability,
          UPC,
          productDescription,
          productType,
          priceExclTax,
          priceInclTax,
          tax,
          numOfReviews,
        };
      });

      allBookInfo.push(singleBookInfo);
    }

    if (nextButton) {
      await page.goto(nextButton);

      allBookLinks = await page.evaluate(() => {
        let books = document.getElementsByClassName('image_container');
        let booksArray = [...books];
        let bookLinks = booksArray.map(book => {
          return book.firstElementChild.href;
        });
        return bookLinks;
      });

      nextButton = await page.evaluate(() => {
        let button = document.getElementsByClassName('next')[0];
        if (!button) {
          return button;
        }
        let buttonLink = button.getElementsByTagName('a')[0].href;
        return buttonLink;
      });
    } else {
      break;
    }
  }
  browser.close();
  return allBookInfo;
};

scrapeBooks().then(value => {
  console.log(value);
});

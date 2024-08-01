const puppeteer = require('puppeteer');

(async () => {

    const URL = "https://www.amazon.com/s?k=PROGRAMMER+SOCKS&crid=23NDX4OY0C0YC&sprefix=programmer+socks%2Caps%2C134&ref=nb_sb_noss_1";

    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(URL, {waitUntil: 'networkidle2'});

    const title = await page.title();
    console.log(`Título de la página: ${title}`);

    let products = [];
    let nextPage = true;
    while (nextPage){
        await page.evaluate(() => {
            document.querySelectorAll('.puis-card-container');
        })
    }

})();
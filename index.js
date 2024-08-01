const puppeteer = require('puppeteer');
const xlsx = require("xlsx");

(async () => {

    // const URL = "https://www.amazon.com/s?k=programming+socks&crid=2N7PNBPAGV4RV&sprefix=progrramming+s%2Caps%2C271&ref=nb_sb_ss_sc_1_13";
    const URL = "https://www.amazon.com/";

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
        const newProducts = await page.evaluate(() => {
            const products = Array.from(document.querySelectorAll('.puis-card-container.s-card-container'));

            return products.map(product => {
                const title = product.querySelector('.a-text-normal')?.innerText;
                const priceWhole = product.querySelector('.a-price-whole')?.innerText;
                const priceFraction = product.querySelector('.a-price-fraction')?.innerText;

                if (!priceWhole || !priceFraction) {
                    return
                }

                const priceWholeCleaned = priceWhole.replace(/\n/g, "").trim();
                const priceFractionCleaned = priceFraction.replace(/\n/g, "").trim();

                return {
                    title,
                    price: `${priceWhole}.${priceFraction}`
                }

            });
        })

        products = [...products, ...newProducts]

        nextPage = await page.evaluate(() => {
            const nextButton = document.querySelector('.s-pagination-next');
            
            if(nextButton && 
                !nextButton.classList.contains('s-pagination-disabled')
            ){
                nextButton.click();
                return true;
            }

            return false;

        })

        await new Promise((resolve) => setTimeout(resolve, 2000));


    }

    console.log(products);

})();
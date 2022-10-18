const express = require('express');
const app = express();
const port = 3000;

const puppeteer = require('puppeteer');

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://finance.yahoo.com/quote/JPY=X/');

    const selector = `fin-streamer[data-test="qsp-price"]`;
    await page.waitForSelector(selector);

    const items = await page.evaluate(result => {
        return [...document.querySelectorAll(result)]
    }, selector);

    browser.close();

    if (items) {
        if (items.length > 0) {
            res.send(items[0].value.toString());
        }
        else {
            res.send();
        }
    }
    else {
        res.send();
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
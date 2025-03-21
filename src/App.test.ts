import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import puppeteer, { Page, Browser } from 'puppeteer';
import path from 'path';

const customConfig = { threshold: 0 };
const toMatchImageSnapshot = configureToMatchImageSnapshot({
    customDiffConfig: customConfig,
    noColors: true,
});
expect.extend({ toMatchImageSnapshot });

let browser: Browser;

beforeAll(async () => {
    browser = await puppeteer.launch({
        args: ['--no-sandbox'],
    });
});

afterAll(async () => {
    await browser.close();
});

describe('Flexbox', () => {
    let page: Page;
    beforeEach(async () => {
        page = await browser.newPage();
        await page.setViewport({ width: 700, height: 300 });
        await page.goto(`file:${path.join(__dirname, '/..', 'index.html')}`);
    });

    it('Верстка не тронута', async () => {
        const container = await page.evaluate(() => document.body.innerHTML);

        expect(container).toMatchSnapshot();
    });

    it('Рисуется нужное изображение', async () => {
        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot();
    });
});

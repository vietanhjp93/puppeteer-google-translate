import launch from '../launch';
import { PuppeteerOptions } from '../types';

export default async (
	query: string[],
	opt: PuppeteerOptions
): Promise<string[]> => {
	const { browser, page, timeout } = await launch(opt);
	const result: string[] = [];
	for (let i = 0; i < query.length; i++) {
		try {
			await page.goto('https://translate.google.com/' + query[i]);
			const el = await page.waitForSelector('span>span>span[jsaction]', {
				timeout
			});
                        result[i] = await el.evaluate((e) => {
                            const rows = document.querySelectorAll(
                                'span>span>span[jsaction]'
                            );
                            let text = '';
                            rows.forEach((row) => {
                                text += row.textContent;
                            });
                            return text;
                        });
		} catch (err) {
			await browser.close();
			throw err;
		}
	}
	await browser.close();
	return result;
};

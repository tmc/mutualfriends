const fs = require('fs');

const fetchFriends = async (browser, name) => {
	const friendSelector = "#BrowseResultsContainer > div > div > div > div > div:nth-child(2) > div > div > div > div > div > div"
	//const friendSelector = "#BrowseResultsContainer > div > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div:nth-child(2)"
	const page = await browser.newPage();
	await page.goto(`https://www.facebook.com/search/top/?q=${name}`);
	await page.waitForSelector("#BrowseResultsContainer", {timeout:1000});
	const el = await page.$(friendSelector);
	const path = `cache/${name}.png`;
	const elText = await page.$eval(friendSelector, (element) => {
    return element.innerText
});
	console.log(elText);
	if (el && elText && elText.search(/friend/i)) {
		try {
			await el.screenshot({path: path});
		} catch(e) {
			console.warn("issue taking screenshot:", e);
		}
	}
	// if we've failed to fetch, copy 1x1
	if (!fs.existsSync(path)) {
		fs.copyFileSync("1x1.png", path)
	}
	
	await page.close()
}

module.exports = { fetchFriends: fetchFriends }

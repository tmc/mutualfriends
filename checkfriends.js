const puppeteer = require('puppeteer');
const fs = require('fs');
const utils = require('./utils.js');
const process = require('process');

const express = require('express');
const app = express();
const port = 3000;

(async () => {
	const bgopts = {
		headless: false,
		userDataDir: "./user_databg",
		defaultViewport: null,
		executablePath: '/Users/tmc/go/src/github.com/tmc/yang/mutualfriends/node_modules/puppeteer/.local-chromium/mac-706915-bg/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
	};
	const opts = {
		headless: false,
		userDataDir: "./user_data",
		//slowMo: 250,
		defaultViewport: null,
		args: ['--disable-web-security', '--allow-running-insecure-content'],

	};
	const isBG = Boolean(process.env['BG'] === '1')
	console.log("bg?", isBG);
	console.log("default path:", puppeteer.executablePath());
	const browser = await puppeteer.launch(isBG ? bgopts : opts);
	const preloadFile = fs.readFileSync('./preload.js', 'utf8');

	if (isBG) {
		app.get('/mfriends', async (req, res) => { console.log("params", req.query);
			const path = `cache/${req.query.name}.png`;
			if (!fs.existsSync(path)) {
				await utils.fetchFriends(browser, req.query.name)
			}
			res.download(path);
		});

		app.listen(port, () => console.log(`mfriends running on ${port}!`))
	} else {
		var i;
		const tabs = [1,2,3,4].map(async (n) => {
			const page = await browser.newPage();
			await page.evaluateOnNewDocument(preloadFile);
			await page.setBypassCSP(true);
			await page.goto('https://www.votebuilder.com/MyList.aspx', {timeout: 10000});
			await page.setBypassCSP(true);
			return page;
		});
	}
})();




function x() {
	var prepName = function(n) {
		var parts = n.split(', ');
		return `${parts[1]} ${parts[0]}`;
	}

	jQuery("#ctl00_ContentPlaceHolderVANPage_gvList > tbody > tr > td > a").each(function(i, name) { jQuery(name).insertAfter("<br/><img src='http://localhost:3000/mfriends?name=" + prepName(name.innerText) +"'/>")})
}

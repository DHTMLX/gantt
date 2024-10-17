const less = require('less');
const path = require("path");
const postcss = require('postcss')
const url = require("postcss-url")
const fs = require('fs')

const argv = require('minimist')(process.argv.slice(2));

let themeArg = argv.file;

if (!themeArg) {
	throw new Error("Theme root file not specified");
}

const theme = String(themeArg).trim();
const inputFolder = `./`;
const inputPath = `${inputFolder}${theme}.less`;
const outputPath = `./${theme}.css`;


if (!theme.match(/^[a-zA-Z0-9_\-]+$/)) {
	throw new Error(`Invalid theme root file: ${theme}, a local less file is expected.`);
}

if (!fs.existsSync(inputPath)) {
	throw new Error(`Theme file is not found: ${theme}`);
}

console.log(`Building: ${inputPath}`);

less.render(fs.readFileSync(inputPath, "utf-8"), { rewriteUrls: "all" })
	.then(function (output) {
		runPostCss(output.css,
			inputPath,
			outputPath
		)
	},
		function (error) {
			console.log(error)
	});

function runPostCss(css, from, to) {
	postcss()
		.use(url({
			url: 'inline'
		}))
		.process(css, {
			from: from,
			to: to
		}).then(result => {
			fs.writeFileSync(outputPath, result.css);
			console.log(`Finished: ${theme} -> ${path.resolve(outputPath)}`);
		}).catch((error) => console.log(error));
}
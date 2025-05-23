const { BuildError, ItemTemplate } = require("../classes");

/** @type {Record<string, ItemTemplate>} */
const ITEMS = {};
const ITEM_NAMES = [];

for (const file of [
	"alertnessbeans.js",
	"clearpotion.js",
	"creativeacorn.js",
	"earthenpotion.js",
	"explosionpotion.js",
	"fierypotion.js",
	"finessefiber.js",
	"flexigrass.js",
	"glowingpotion.js",
	"healthpotion.js",
	"inkypotion.js",
	"panacea.js",
	"placebo.js",
	"poppopfruit.js",
	"portablespellbookcharger.js",
	"protectionpotion.js",
	"quickpepper.js",
	"regenroot.js",
	"smokebomb.js",
	"strengthspinach.js",
	"vitamins.js",
	"waterypotion.js",
	"windypotion.js"
]) {
	const item = require(`./${file}`);
	if (item.name.toLowerCase() in ITEMS) {
		throw new BuildError(`Duplicate item name (${item.name})`);
	}
	ITEMS[item.name.toLowerCase()] = item;
	ITEM_NAMES.push(item.name);
}

/** @param {string} itemName */
function itemExists(itemName) {
	return itemName.toLowerCase() in ITEMS;
}

/** Template should not be mutated
 * @param {string} itemName
 */
function getItem(itemName) {
	return ITEMS[itemName.toLowerCase()];
}

module.exports = {
	itemNames: ITEM_NAMES,
	itemExists,
	getItem
}

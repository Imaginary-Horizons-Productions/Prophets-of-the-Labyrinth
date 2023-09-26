const { BuildError, ItemTemplate } = require("../classes");

/** @type {Record<string, ItemTemplate>} */
const ITEMS = {};

for (const file of [
	"blockpotion.js",
	"clearpotion.js",
	"earthenpotion.js",
	"explosionpotion.js",
	"fierypotion.js",
	"glowingpotion.js",
	"healthpotion.js",
	"inkypotion.js",
	"oblivionsalt.js",
	"quickpepper.js",
	"regenroot.js",
	"repairkit.js",
	"smokebomb.js",
	"stasisquartz.js",
	"strengthspinach.js",
	"vitamins.js",
	"waterypotion.js",
	"windypotion.js"
]) {
	const item = require(`./${file}`);
	if (item.name in ITEMS) {
		throw new BuildError(`Duplicate item name (${item.name})`);
	}
	ITEMS[item.name] = item;
}

exports.itemNames = Object.keys(ITEMS);

/** @param {string} itemName */
exports.itemExists = function (itemName) {
	return itemName in ITEMS;
}

/** Template should not be mutated
 * @param {string} itemName
 */
exports.getItem = function (itemName) {
	return ITEMS[itemName];
}

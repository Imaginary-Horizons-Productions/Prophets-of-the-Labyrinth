const { ModifierTemplate, BuildError } = require("../classes");
const { sanitizeEmojiName } = require("../util/graphicsUtil");
const { calculateTagContent } = require("../util/textUtil");

/** @type {Record<string, ModifierTemplate>} */
const MODIFIERS = {};

for (const file of [
	"absorb-darkness.js",
	"absorb-earth.js",
	"absorb-fire.js",
	"absorb-light.js",
	"absorb-untyped.js",
	"absorb-water.js",
	"absorb-wind.js",
	"agility.js",
	"curse-of-midas.js",
	"distracted.js",
	"evade.js",
	"exposed.js",
	"frail.js",
	"insult-boring.js",
	"insult-lacking-rhythm.js",
	"insult-smelly.js",
	"insult-stupid.js",
	"insult-ugly.js",
	"lucky.js",
	"oblivious.js",
	"paralysis.js",
	"poison.js",
	"power-down.js",
	"power-up.js",
	"progress.js",
	"quicken.js",
	"regen.js",
	"retain.js",
	"slow.js",
	"stance-floating-mist.js",
	"stance-iron-fist.js",
	"the-target.js",
	"unlucky.js",
	"vigilance.js",
	"weakness-darkness.js",
	"weakness-earth.js",
	"weakness-fire.js",
	"weakness-light.js",
	"weakness-untyped.js",
	"weakness-water.js",
	"weakness-wind.js"
]) {
	/** @type {ModifierTemplate} */
	const modifier = require(`./${file}`);
	if (modifier.name in MODIFIERS) {
		throw new BuildError(`Duplicate modifier name (${modifier.name})`);
	}
	MODIFIERS[modifier.name] = modifier;
}

/** @returns {[name: string, attachment: string][]} */
function getModifierEmojiFileTuples() {
	return Object.keys(MODIFIERS).map(modifierName => {
		const sanitizedName = sanitizeEmojiName(modifierName);
		return [sanitizedName, `./source/images/modifierEmoji/${sanitizedName}.png`];
	})
}

/**
 * @param {string} modifierName
 * @param {number} stacks
 * @param {number} bearerPoise
 * @param {number} funnelCount
 */
function getModifierDescription(modifierName, stacks, bearerPoise, funnelCount) {
	return calculateTagContent(MODIFIERS[modifierName].description, [
		{ tag: 'stacks', count: stacks },
		{ tag: 'poise', count: bearerPoise },
		{ tag: 'funnelCount', count: funnelCount }
	]);
}

/** @param {string} modifierName */
function getModifierCategory(modifierName) {
	return MODIFIERS[modifierName].category;
}

/** @param {string} modifierName */
function getMoveDecrement(modifierName) {
	return MODIFIERS[modifierName].moveDecrement;
}

/** @param {string} modifierName */
function getRoundDecrement(modifierName) {
	return MODIFIERS[modifierName].roundDecrement;
}

/** @param {string} modifierName */
function getInverse(modifierName) {
	return MODIFIERS[modifierName].inverse;
}

module.exports = {
	getModifierEmojiFileTuples,
	getModifierDescription,
	getModifierCategory,
	getMoveDecrement,
	getRoundDecrement,
	getInverse
};

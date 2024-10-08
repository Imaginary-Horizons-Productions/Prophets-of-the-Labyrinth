const { Adventure, ModifierTemplate, BuildError, Combatant } = require("../classes");
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
	"slow.js",
	"stance-floating-mist.js",
	"stance-iron-fist.js",
	"stasis.js",
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

/**
 * @param {string} modifierName
 * @param {Combatant} bearer
 * @param {Adventure} adventure
 */
function getModifierDescription(modifierName, bearer, adventure) {
	return calculateTagContent(MODIFIERS[modifierName].description, [
		{ tag: 'stackCount', count: bearer.modifiers[modifierName] },
		{ tag: 'poise', count: bearer.getPoise() },
		{ tag: 'funnelCount', count: adventure.getArtifactCount("Spiral Funnel") },
		{ tag: 'roundDecrement', count: getTurnDecrement(modifierName) }
	]);
}

/** @param {string} modifierName */
function getModifierEmoji(modifierName) {
	return MODIFIERS[modifierName].emoji;
}

/** @param {string} modifierName */
function getTurnDecrement(modifierName) {
	return MODIFIERS[modifierName].turnDecrement;
}

/** @param {string} modifierName */
function isBuff(modifierName) {
	return MODIFIERS[modifierName].isBuff;
}

/** @param {string} modifierName */
function isDebuff(modifierName) {
	return MODIFIERS[modifierName].isDebuff;
}

/** @param {string} modifierName */
function getInverse(modifierName) {
	return MODIFIERS[modifierName].inverse;
}

module.exports = {
	getModifierDescription,
	getModifierEmoji,
	getTurnDecrement,
	isBuff,
	isDebuff,
	getInverse
};

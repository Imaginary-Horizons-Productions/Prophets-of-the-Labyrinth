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
	"curse-of-midas.js",
	"evade.js",
	"exposed.js",
	"oblivious.js",
	"poison.js",
	"power-down.js",
	"power-up.js",
	"progress.js",
	"quicken.js",
	"regen.js",
	"slow.js",
	"stagger.js",
	"stasis.js",
	"vigilance.js",
	"stun.js"
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
		{ tag: 'poise', count: bearer.staggerThreshold },
		{ tag: 'funnelCount', count: adventure.getArtifactCount("Spiral Funnel") },
		{ tag: 'roundDecrement', count: getTurnDecrement(modifierName) }
	]);
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
function isNonStacking(modifierName) {
	return MODIFIERS[modifierName].isNonStacking;
}

/** @param {string} modifierName */
function getInverse(modifierName) {
	return MODIFIERS[modifierName].inverse;
}

module.exports = {
	getModifierDescription,
	getTurnDecrement,
	isBuff,
	isDebuff,
	isNonStacking,
	getInverse
};

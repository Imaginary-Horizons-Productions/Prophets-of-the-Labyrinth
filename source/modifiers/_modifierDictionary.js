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
	"boring.js",
	"curse-of-midas.js",
	"evade.js",
	"exposed.js",
	"frail.js",
	"lacking-rhythm.js",
	"oblivious.js",
	"paralysis.js",
	"poison.js",
	"power-down.js",
	"power-up.js",
	"progress.js",
	"quicken.js",
	"regen.js",
	"slow.js",
	"smelly.js",
	"stance-floating-mist.js",
	"stance-iron-fist.js",
	"stasis.js",
	"stupid.js",
	"ugly.js",
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
	getTurnDecrement,
	isBuff,
	isDebuff,
	getInverse
};

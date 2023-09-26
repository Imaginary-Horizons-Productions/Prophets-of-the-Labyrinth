const { Adventure, ModifierTemplate, BuildError, Combatant } = require("../classes");
// const { calculateTagContent } = require("../../helpers");

/** @type {Record<string, ModifierTemplate>} */
const MODIFIERS = {};

for (const file of [
	"absorb-earth.js",
	"absorb-fire.js",
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
exports.getModifierDescription = function (modifierName, bearer, adventure) {
	return calculateTagContent(MODIFIERS[modifierName].description, [
		{ tag: 'stackCount', count: bearer.modifiers[modifierName] },
		{ tag: 'poise', count: bearer.staggerThreshold },
		{ tag: 'funnelCount', count: adventure.getArtifactCount("Spiral Funnel") },
		{ tag: 'roundDecrement', count: exports.getTurnDecrement(modifierName) }
	]);
}

/** @param {string} modifierName */
exports.getTurnDecrement = (modifierName) => {
	return MODIFIERS[modifierName].turnDecrement;
}

/** @param {string} modifierName */
exports.isBuff = (modifierName) => {
	return MODIFIERS[modifierName].isBuff;
}

/** @param {string} modifierName */
exports.isDebuff = (modifierName) => {
	return MODIFIERS[modifierName].isDebuff;
}

/** @param {string} modifierName */
exports.isNonStacking = (modifierName) => {
	return MODIFIERS[modifierName].isNonStacking;
}

/** @param {string} modifierName */
exports.getInverse = (modifierName) => {
	return MODIFIERS[modifierName].inverse;
}

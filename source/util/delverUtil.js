const { getArchetype } = require("../archetypes/_archetypeDictionary");
const { Delver, Adventure } = require("../classes");
const { gainHealth } = require("./combatantUtil");

/**
 * @param {Delver} delver
 * @param {number} levels
 * @param {Adventure} adventure
 */
function levelUp(delver, levels, adventure) {
	delver.level += levels;
	const { maxHPGrowth, powerGrowth, speedGrowth, critRateGrowth, poiseGrowth } = getArchetype(delver.archetype);
	delver.maxHP += maxHPGrowth * levels;
	gainHealth(delver, maxHPGrowth * levels, adventure);
	delver.power += powerGrowth * levels;
	delver.speed += speedGrowth * levels;
	delver.critRate += critRateGrowth * levels;
	delver.poise += poiseGrowth * levels;
}

module.exports = {
	levelUp
};

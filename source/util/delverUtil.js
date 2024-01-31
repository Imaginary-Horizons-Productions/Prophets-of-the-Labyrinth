const { getArchetype } = require("../archetypes/_archetypeDictionary");
const { Delver, Adventure } = require("../classes");
const { getGearProperty, buildGearRecord } = require("../gear/_gearDictionary");
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

/** Usable for both upgrading and sidegrading gear
 * @param {Delver} delver
 * @param {number} index the gear piece's index in the delver's gear array, in case of gear with same name
 * @param {string} oldGearName
 * @param {string} newGearName
 */
function transformGear(delver, index, oldGearName, newGearName) {
	const upgradeDurability = getGearProperty(newGearName, "maxDurability");
	const durabilityDifference = upgradeDurability - getGearProperty(oldGearName, "maxDurability");
	if (durabilityDifference > 0) {
		delver.gear[index].durability += durabilityDifference;
	}
	delver.gear.splice(index, 1, buildGearRecord(newGearName, Math.min(upgradeDurability, delver.gear[index].durability)));
}

module.exports = {
	levelUp,
	transformGear
};

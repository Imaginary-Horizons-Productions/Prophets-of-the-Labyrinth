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
	const manualGrowth = adventure.getArtifactCount("Manual Manual") * 0.1;
	if (manualGrowth > 0) {
		adventure.updateArtifactStat("Manual Manual", "Bonus Stats Percent", manualGrowth * 100);
	}
	let growthBonus = 1 + manualGrowth;
	for (const gearName in delver.gear) {
		if (gearName.startsWith("Wise")) {
			growthBonus += 0.1;
		}
	}
	delver.maxHP += maxHPGrowth * levels * growthBonus;
	gainHealth(delver, maxHPGrowth * levels * growthBonus, adventure);
	delver.power += powerGrowth * levels * growthBonus;
	delver.speed += speedGrowth * levels * growthBonus;
	delver.critRate += critRateGrowth * levels * growthBonus;
	delver.poise += poiseGrowth * levels * growthBonus;
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

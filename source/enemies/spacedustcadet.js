const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require("../constants");
const { selectRandomFoe, selectMultipleRandomFoes, selectAllAllies } = require("../shared/actionComponents");
const { generateModifierResultLines, addModifier, changeStagger } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new EnemyTemplate("Spacedust Cadet",
	"Wind",
	250,
	110,
	"5",
	0,
	"random",
	false
).addAction({
	name: "Sword Thrust",
	essence: "Wind",
	description: `Deal ${getEmoji("Wind")} damage to a foe, gain protection on Critical`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		const pendingDamage = 50 + user.getPower();
		const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, "Wind", adventure);
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		return damageResults.concat(resultLines);
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Gaseous Haze",
	essence: "Unaligned",
	description: "Inflict @e{Exposure} on multiple random foes, gain protection on Critical",
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return generateModifierResultLines(addModifier(targets, { name: "Exposure", stacks: 2 })).concat(resultLines);
	},
	selector: selectMultipleRandomFoes(3),
	next: "random"
}).addAction({
	name: "Slipstream",
	essence: "Unaligned",
	description: "Grant all allies @e{Swiftness}, gain protection on Critical",
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		return generateModifierResultLines(addModifier(targets, { name: "Swiftness", stacks: 5 })).concat(resultLines);
	},
	selector: selectAllAllies,
	next: "random"
});

const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require("../constants");
const { selectRandomFoe, selectSelfAndRandomOtherAlly } = require("../shared/actionComponents");
const { generateModifierResultLines, addModifier, changeStagger, dealDamage, addProtection } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new EnemyTemplate("Luna Militissa",
	"Darkness",
	350,
	100,
	"6",
	0,
	"random",
	false
).addAction({
	name: "Eclipse",
	essence: "Unaligned",
	description: "Gain protection and grant protection to a random other ally",
	priority: 0,
	effect: (targets, user, adventure) => {
		let pendingProtection = 50;
		if (user.crit) {
			pendingProtection *= 2;
		}
		addProtection(targets, pendingProtection);
		changeStagger(targets, ESSENCE_MATCH_STAGGER_ALLY);
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection.")];
	},
	selector: selectSelfAndRandomOtherAlly,
	next: "random"
}).addAction({
	name: "Blackout",
	essence: "Unaligned",
	description: "Inflict great @e{Frailty} on a foe, gain protection on Critical",
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		changeStagger(targets, ESSENCE_MATCH_STAGGER_FOE);
		return generateModifierResultLines(addModifier(targets, { name: "Frailty", stacks: 5 })).concat(resultLines);
	},
	selector: selectRandomFoe,
	next: "Knighty Night Bash"
}).addAction({
	name: "Knighty Night Bash",
	essence: "Darkness",
	description: `Strike a foe for ${getEmoji("Earth")} damage and Stagger them, gain protection on Critical; damage increases with protection`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		const pendingDamage = 50 + user.getPower() + user.protection;
		const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, "Darkness", adventure);
		if (survivors.length > 0) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE + 2);
			resultLines.push(joinAsStatement(false, survivors.map(target => target.name), "is", "are", "Staggered."));
		}
		return damageResults.concat(resultLines);
	},
	selector: selectRandomFoe,
	next: "random"
});

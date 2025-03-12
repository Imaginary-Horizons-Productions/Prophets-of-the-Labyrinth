const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require("../constants");
const { selectAllCombatants, selectRandomFoe, selectRandomOtherAlly } = require("../shared/actionComponents");
const { changeStagger, generateModifierResultLines, addModifier, combineModifierReceipts, addProtection, dealDamage } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new EnemyTemplate("Comet the Sun Dog",
	"Water",
	300,
	100,
	"6",
	0,
	"random",
	false
).addAction({
	name: "Freefall Frenzy",
	essence: "Unaligned",
	description: "Grant @e{Empowerment} to all combatants (friend and foe); grant protection to allies on Critical",
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Empowerment", stacks: 20 })));
		if (user.crit) {
			const livingEnemies = adventure.room.enemies.filter(c => c.hp > 0);
			addProtection(livingEnemies, 50);
			resultLines.push(joinAsStatement(false, livingEnemies.map(enemy => enemy.name), "gains", "gain", "protection."));
		}
		return resultLines;
	},
	selector: selectAllCombatants,
	next: "random"
}).addAction({
	name: "Chilling Bark",
	essence: "Water",
	description: `Stagger and deal minor ${getEmoji("Water")} damage to a foe, gain protection on Critical`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE + 2);
		const pendingDamage = 25 + user.getPower();
		const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, "Water", adventure);
		return damageResults.concat(resultLines, joinAsStatement(false, survivors.map(target => target.name), "is", "are", "Staggered."));
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Cooling Swipe",
	essence: "Unaligned",
	description: `Grant @e{Regeneration} to anonter ally, gain protection on Critical`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		return generateModifierResultLines(addModifier(targets, { name: "Regeneration", stacks: 4 })).concat(resultLines);
	},
	selector: selectRandomOtherAlly,
	next: "random"
});

const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger, addProtection, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectAllCombatants } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");

module.exports = new EnemyTemplate("Meteor Knight",
	"Fire",
	225,
	70,
	"3",
	0,
	"Armored Avalanche",
	false
).addAction({
	name: "Sonic Slash",
	essence: "Fire",
	description: `Deal ${getEmoji("Fire")} damage to a foe with priority`,
	priority: 1,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 60;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure);
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Armored Avalanche",
	essence: "Fire",
	description: `Deal ${getEmoji("Fire")} damage to a foe, deal extra if they don't have protection`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const baseDamage = user.getPower() + 75;
		const bonusDamage = 25
		let results = [];
		for (const target of targets) {
			const pendingDamage = (user.crit ? 2 : 1) * ((target.protection > 0 ? 0 : bonusDamage) + baseDamage);
			results.push(...dealDamage([target], user, pendingDamage, false, user.essence, adventure));
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return results;
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Freefall Flare-Up",
	essence: "Unaligned",
	description: `Grant @e{Empowerment} to all combatants (friend and foe); grant protection to allies on Critical`,
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
	next: "Sonic Slash"
});

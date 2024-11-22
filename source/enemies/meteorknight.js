const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger, addProtection, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectAllCombatants } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

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
	element: "Fire",
	description: `Inflict ${getEmoji("Fire")} damage with Priority`,
	priority: 1,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 60;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Armored Avalanche",
	element: "Fire",
	description: `Deals ${getEmoji("Fire")} damage, with bonus damage to targets without protection`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const baseDamage = user.getPower() + 75;
		const bonusDamage = 25
		let results = [];
		for (const target of targets) {
			const pendingDamage = (user.crit ? 2 : 1) * ((target.protection > 0 ? 0 : bonusDamage) + baseDamage);
			results.push(...dealDamage([target], user, pendingDamage, false, user.element, adventure));
		}
		changeStagger(targets, "elementMatchFoe");
		return results;
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Freefall Flare-Up",
	element: "Untyped",
	description: `Grant @e{Power Up} to all combatants (friend and foe); Protects non-delvers on crit`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Power Up", stacks: 20 })));
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

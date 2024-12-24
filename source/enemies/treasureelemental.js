const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_ALLY } = require("../constants.js");
const { selectAllFoes, selectRandomFoe } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, addProtection, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil.js");

module.exports = new EnemyTemplate("Treasure Elemental",
	"Earth",
	600,
	100,
	"n*3",
	0,
	"random",
	true
).addStartingModifier("Curse of Midas", 1)
	.addAction({
		name: "Reinforcing Slam",
		essence: "Earth",
		description: `Gain protection and deal ${getEmoji("Earth")} damage to a single foe`,
		priority: 0,
		effect: (targets, user, adventure) => {
			let damage = user.getPower() + 100;
			addProtection([user], user.crit ? 100 : 50);
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
			return dealDamage(targets, user, damage, false, user.essence, adventure).concat([`${user.name} gains protection.`]);
		},
		selector: selectRandomFoe,
		next: "random"
	}).addAction({
		name: "Hail of Gemstones",
		essence: "Earth",
		description: `Deal ${getEmoji("Earth")} damage to a single foe three times`,
		priority: 0,
		effect: (targets, user, adventure) => {
			let damage = user.getPower() + 25;
			if (user.crit) {
				damage *= 2;
			}
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
			const texts = [];
			for (let i = 0; i < 3; i++) {
				texts.push(...dealDamage(targets, user, damage, false, user.essence, adventure));
			}
			return texts;
		},
		selector: selectRandomFoe,
		next: "random"
	}).addAction({
		name: "Heavy Pockets",
		essence: "Unaligned",
		description: "Inflict @e{Slow} on all foes",
		priority: 0,
		effect: (targets, user, adventure) => {
			let stacks = 2;
			if (user.crit) {
				stacks *= 2;
			}
			return generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Slow", stacks })));
		},
		selector: selectAllFoes,
		next: "random"
	});

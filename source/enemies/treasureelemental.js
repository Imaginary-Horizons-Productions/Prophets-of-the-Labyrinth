const { EnemyTemplate } = require("../classes");
const { selectAllFoes, selectRandomFoe } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, addProtection, getNames } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

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
		element: "Earth",
		description: `Gain protection and deal ${getEmoji("Earth")} damage to a single foe`,
		priority: 0,
		effect: (targets, user, isCrit, adventure) => {
			let damage = user.getPower() + 100;
			addProtection([user], isCrit ? 100 : 50);
			changeStagger([user], "elementMatchAlly");
			return `It gains protection and ${dealDamage(targets, user, damage, false, user.element, adventure)}`;
		},
		selector: selectRandomFoe,
		needsLivingTargets: false,
		next: "random"
	}).addAction({
		name: "Hail of Gemstones",
		element: "Earth",
		description: `Deal ${getEmoji("Earth")} damage to a single foe three times`,
		priority: 0,
		effect: (targets, user, isCrit, adventure) => {
			let damage = user.getPower() + 25;
			if (isCrit) {
				damage *= 2;
			}
			changeStagger([user], "elementMatchAlly");
			let text = "";
			for (let i = 0; i < 3; i++) {
				text += dealDamage(targets, user, damage, false, user.element, adventure);
			}
			return text;
		},
		selector: selectRandomFoe,
		needsLivingTargets: false,
		next: "random"
	}).addAction({
		name: "Heavy Pockets",
		element: "Untyped",
		description: "Inflict Slow on all foes",
		priority: 0,
		effect: (targets, user, isCrit, adventure) => {
			let stacks = 2;
			if (isCrit) {
				stacks *= 2;
			}
			const slowedTargets = addModifier(targets, { name: "Slow", stacks });
			if (slowedTargets.length > 0) {
				return joinAsStatement(false, getNames(slowedTargets, adventure), "is", "are", "Slowed trying to grab at some treasure.");
			} else {
				return "But nothing happened.";
			}
		},
		selector: selectAllFoes,
		needsLivingTargets: false,
		next: "random"
	});

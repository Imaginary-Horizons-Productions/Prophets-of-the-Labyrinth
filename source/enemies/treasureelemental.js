const { EnemyTemplate } = require("../classes");
const { selectAllFoes, selectRandomFoe, nextRandom } = require("../shared/actionComponents.js");
const { addModifier, dealDamage } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil.js");
const { listifyEN } = require("../util/textUtil.js");

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
		effect: ([target], user, isCrit, adventure) => {
			let damage = user.getPower() + 100;
			user.protection += isCrit ? 100 : 50;
			user.addStagger("elementMatchAlly");
			return `It gains protection and ${dealDamage([target], user, damage, false, user.element, adventure)}`;
		},
		selector: selectRandomFoe,
		needsLivingTargets: false,
		next: nextRandom
	}).addAction({
		name: "Hail of Gemstones",
		element: "Earth",
		description: `Deal ${getEmoji("Earth")} damage to a single foe three times`,
		priority: 0,
		effect: ([target], user, isCrit, adventure) => {
			let damage = user.getPower() + 25;
			if (isCrit) {
				damage *= 2;
			}
			user.addStagger("elementMatchAlly");
			let text = dealDamage([target], user, damage, false, user.element, adventure);
			text += dealDamage([target], user, damage, false, user.element, adventure);
			text += dealDamage([target], user, damage, false, user.element, adventure);
			return text;
		},
		selector: selectRandomFoe,
		needsLivingTargets: false,
		next: nextRandom
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
			const slowedTargets = [];
			targets.forEach(target => {
				const addedSlow = addModifier(target, { name: "Slow", stacks });
				if (addedSlow) {
					slowedTargets.push(target.getName(adventure.room.enemyIdMap));
				}
			});
			if (slowedTargets.length > 1) {
				return `${listifyEN(slowedTargets)} are Slowed trying to grab at some treasure.`;
			} else if (slowedTargets.length === 1) {
				return `${slowedTargets[0]} is Slowed trying to grab at some treasure.`;
			} else {
				return "But nothing happened.";
			}
		},
		selector: selectAllFoes,
		needsLivingTargets: false,
		next: nextRandom
	});

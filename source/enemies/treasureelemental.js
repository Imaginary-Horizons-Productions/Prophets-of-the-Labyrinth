const { EnemyTemplate } = require("../classes");
const { selectSelf, selectNone, selectAllFoes, selectRandomFoe } = require("../shared/actionComponents.js");
const { addModifier, addBlock, dealDamage } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil.js");
const { listifyEN } = require("../util/textUtil.js");

const PATTERN = {
	"Reinforcing Slam": "Burrow",
	"Burrow": "Eyes of Greed",
	"Eyes of Greed": "Heavy Pockets",
	"Heavy Pockets": "Escape",
	"Escape": "Escape"
}
function treasureElementalPattern(actionName) {
	return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Treasure Elemental",
	"Earth",
	99999,
	100,
	"n*3",
	0,
	"Reinforcing Slam",
	true
).addStartingModifier("Curse of Midas", 1)
	.addAction({
		name: "Reinforcing Slam",
		element: "Earth",
		description: `Gain Block and deal ${getEmoji("Earth")} damage to a single foe`,
		priority: 0,
		effect: ([target], user, isCrit, adventure) => {
			let damage = user.getPower() + 100;
			let block = 100;
			if (isCrit) {
				block *= 2;
			}
			addBlock(user, block);
			user.addStagger("elementMatchAlly");
			return `It prepares to Block and ${dealDamage([target], user, damage, false, user.element, adventure)}`;
		},
		selector: selectRandomFoe,
		needsLivingTargets: false,
		next: treasureElementalPattern
	}).addAction({
		name: "Burrow",
		element: "Untyped",
		description: "Gain Evade",
		priority: 0,
		effect: (target, user, isCrit, adventure) => {
			let stacks = 2;
			if (isCrit) {
				stacks *= 3;
			}
			const addedEvade = addModifier(user, { name: "Evade", stacks });
			user.addStagger("elementMatchAlly");
			if (addedEvade) {
				return "It scatters among the other treasure in the room to Evade.";
			} else {
				return "But nothing happened.";
			}
		},
		selector: selectSelf,
		needsLivingTargets: false,
		next: treasureElementalPattern
	})
	.addAction({
		name: "Eyes of Greed",
		element: "Untyped",
		description: "Gain Curse of Midas and inflict Power Down on all foes",
		priority: 0,
		effect: (targets, user, isCrit, adventure) => {
			let stacks = 25;
			if (isCrit) {
				stacks *= 2;
			}
			const addedCurse = addModifier(user, { name: "Curse of Midas", stacks: 1 });
			const poweredDownTargets = [];
			targets.forEach(target => {
				const addedPowerDown = addModifier(target, { name: "Power Down", stacks });
				if (addedPowerDown) {
					poweredDownTargets.push(target.getName(adventure.room.enemyIdMap));
				}
				target.addStagger("elementMatchFoe");
			});
			if (poweredDownTargets.length > 1) {
				return `${listifyEN(poweredDownTargets)} are Powered Down${addedCurse ? ", distracted by the treasure elemental sparkling brighter" : ""}.`;
			} else if (poweredDownTargets.length === 1) {
				return `${poweredDownTargets[0]} is Powered Down${addedCurse ? ", distracted by the treasure elemental sparkling brighter" : ""}.`;
			} else {
				if (addedCurse) {
					return "The treasure elemental sparkles brighter.";
				} else {
					return "But nothing happened.";
				}
			}
		},
		selector: selectAllFoes,
		needsLivingTargets: false,
		next: treasureElementalPattern
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
		next: treasureElementalPattern
	}).addAction({
		name: "Escape",
		element: "Untyped",
		description: "Escape combat",
		priority: 0,
		effect: (targets, user, isCrit, adventure) => {
			user.hp = 0;
			return "The treasure elemental makes its escape!";
		},
		selector: selectNone,
		needsLivingTargets: false,
		next: treasureElementalPattern
	});

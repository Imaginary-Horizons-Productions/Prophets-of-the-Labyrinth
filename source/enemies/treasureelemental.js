const { EnemyTemplate } = require("../classes");
const { selectSelf, selectNone, selectAllFoes, selectRandomFoe } = require("../util/actionComponents.js");
// const { addModifier, addBlock, removeModifier, dealDamage } = require("../combatantDAO.js");

const PATTERN = {
	"Guarding Slam": "Burrow",
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
	3,
	0,
	"Guarding Slam",
	true
).addStartingModifier("Curse of Midas", 1)
	.addAction({
		name: "Guarding Slam",
		element: "Earth",
		priority: 0,
		effect: ([target], user, isCrit, adventure) => {
			let block = 100;
			if (isCrit) {
				block *= 2;
			}
			addBlock(user, block);
			removeModifier(user, { name: "Stagger", stacks: 1 });
			return dealDamage([target], user, 100, false, user.element, adventure).then(damageText => {
				return `It prepares to Block and ${damageText}`;
			});
		},
		selector: selectRandomFoe,
		next: treasureElementalPattern
	}).addAction({
		name: "Burrow",
		element: "Untyped",
		priority: 0,
		effect: (target, user, isCrit, adventure) => {
			let stacks = 2;
			if (isCrit) {
				stacks *= 3;
			}
			addModifier(user, { name: "Evade", stacks });
			removeModifier(user, { name: "Stagger", stacks: 1 });
			return "It scatters among the other treasure in the room to Evade.";
		},
		selector: selectSelf,
		next: treasureElementalPattern
	})
	.addAction({
		name: "Eyes of Greed",
		element: "Untyped",
		priority: 0,
		effect: (targets, user, isCrit, adventure) => {
			let stacks = 25;
			if (isCrit) {
				stacks *= 2;
			}
			addModifier(user, { name: "Curse of Midas", stacks: 1 });
			targets.forEach(target => {
				addModifier(target, { name: "Power Down", stacks });
				addModifier(target, { name: "Stagger", stacks: 1 });
			});
			return "Everyone is Powered Down, due to being distracted by a treasure that catches their eyes.";
		},
		selector: selectAllFoes,
		next: treasureElementalPattern
	}).addAction({
		name: "Heavy Pockets",
		element: "Untyped",
		priority: 0,
		effect: (targets, user, isCrit, adventure) => {
			let stacks = 2;
			if (isCrit) {
				stacks *= 2;
			}
			targets.forEach(target => {
				addModifier(target, { name: "Slow", stacks });
			});
			return "Everyone is Slowed trying to grab at some treasure.";
		},
		selector: selectAllFoes,
		next: treasureElementalPattern
	}).addAction({
		name: "Escape",
		element: "Untyped",
		priority: 0,
		effect: (targets, user, isCrit, adventure) => {
			user.hp = 0;
			return "The treasure elemental makes its escape!";
		},
		selector: selectNone,
		next: treasureElementalPattern
	});

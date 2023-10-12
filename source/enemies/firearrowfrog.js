const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { addModifier, removeModifier, dealDamage } = require("../util/combatantUtil");

const PATTERN = {
	"Venom Cannon": "random",
	"Burrow": "Venom Cannon",
	"Goop Spray": "Venom Cannon"
}
function firearrowFrogPattern(actionName) {
	return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Fire-Arrow Frog",
	"Fire",
	250,
	100,
	"2",
	0,
	"random",
	false
).addAction({
	name: "Venom Cannon",
	element: "Fire",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = 20;
		if (isCrit) {
			addModifier(target, { name: "Poison", stacks: 6 });
		} else {
			addModifier(target, { name: "Poison", stacks: 3 });
		}
		return `${target.getName(adventure.room.enemyIdMap)} is Poisoned. ${dealDamage([target], user, damage, false, user.element, adventure)}`;
	},
	selector: selectRandomFoe,
	next: firearrowFrogPattern
}).addAction({
	name: "Burrow",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let stacks = 2;
		if (isCrit) {
			stacks *= 3;
		}
		addModifier(user, { name: "Evade", stacks });
		removeModifier(user, { name: "Stagger", stacks: 1 });
		return "It's prepared to Evade.";
	},
	selector: selectSelf,
	next: firearrowFrogPattern
}).addAction({
	name: "Goop Spray",
	element: "Untyped",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		if (isCrit) {
			addModifier(target, { name: "Slow", stacks: 3 });
			addModifier(target, { name: "Stagger", stacks: 1 });
		} else {
			addModifier(target, { name: "Slow", stacks: 2 });
		}
		return `${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
	},
	selector: selectRandomFoe,
	next: firearrowFrogPattern
});

const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { addModifier, dealDamage } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil.js");

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
	"4",
	0,
	"random",
	false
).addAction({
	name: "Venom Cannon",
	element: "Fire",
	description: `Inflict minor ${getEmoji("Fire")} damage and Poison on a single foe`,
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let addedPoison = false;
		let damage = 20;
		if (isCrit) {
			addedPoison = addModifier(target, { name: "Poison", stacks: 6 });
		} else {
			addedPoison = addModifier(target, { name: "Poison", stacks: 3 });
		}
		return `${addedPoison ? `${target.getName(adventure.room.enemyIdMap)} is Poisoned. ` : ""}${dealDamage([target], user, damage, false, user.element, adventure)}`;
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: firearrowFrogPattern
}).addAction({
	name: "Burrow",
	element: "Untyped",
	description: "Gain Evade",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let stacks = 2;
		if (isCrit) {
			stacks *= 3;
		}
		const addedEvade = addModifier(user, { name: "Evade", stacks });
		user.addStagger("elementMatchAlly");
		if (addedEvade) {
			return "It's prepared to Evade.";
		} else {
			return "But nothing happened.";
		}
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: firearrowFrogPattern
}).addAction({
	name: "Goop Spray",
	element: "Untyped",
	description: "Slow a single foe",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let addedSlow = false;
		if (isCrit) {
			addedSlow = addModifier(target, { name: "Slow", stacks: 3 });
			target.addStagger("elementMatchFoe");
		} else {
			addedSlow = addModifier(target, { name: "Slow", stacks: 2 });
		}
		if (addedSlow) {
			return `${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
		} else {
			return "But nothing happned.";
		}
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: firearrowFrogPattern
});

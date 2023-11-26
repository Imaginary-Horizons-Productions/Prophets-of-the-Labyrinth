const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");

const PATTERN = {
	"Barrel Roll": "Sting",
	"Sting": "Neurotoxin Strike",
	"Neurotoxin Strike": "Self-Destruct",
	"Self-Destruct": "Barrel Roll"
}
function soldierPattern(actionName) {
	return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Mechabee Soldier",
	"Earth",
	250,
	100,
	"6",
	0,
	"Barrel Roll",
	false
).addAction({
	name: "Sting",
	element: "Earth",
	description: `Inflict minor ${getEmoji("Earth")} damage and Poison on a single foe`,
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		target.addStagger("elementMatchFoe");
		if (isCrit) {
			addModifier(target, { name: "Poison", stacks: 4 });
		} else {
			addModifier(target, { name: "Poison", stacks: 2 });
		}
		return dealDamage([target], user, 10, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: soldierPattern
}).addAction({
	name: "Barrel Roll",
	element: "Untyped",
	description: "Gain Evade",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let stacks = 2;
		if (isCrit) {
			stacks *= 3;
		}
		addModifier(user, { name: "Evade", stacks });
		user.addStagger("elementMatchAlly");
		return "It's prepared to Evade.";
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: soldierPattern
}).addAction({
	name: "Neurotoxin Strike",
	element: "Earth",
	description: `Inflict ${getEmoji("Earth")} damage and Paralysis on a single foe`,
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		target.addStagger("elementMatchFoe");
		if (isCrit) {
			addModifier(target, { name: "Paralysis", stacks: 5 });
		} else {
			addModifier(target, { name: "Paralysis", stacks: 3 });
		}
		return dealDamage([target], user, 40, false, user.element, adventure);
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: soldierPattern
}).addAction({
	name: "Self-Destruct",
	element: "Earth",
	description: `Sacrifice self to deal large ${getEmoji("Earth")} damage to all foes`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = 125;
		if (isCrit) {
			damage *= 2;
		}
		user.hp = 0;
		targets.map(target => {
			target.addStagger("elementMatchFoe");
		})

		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: soldierPattern
});

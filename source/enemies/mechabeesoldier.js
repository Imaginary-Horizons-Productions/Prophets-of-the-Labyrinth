const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger, getNames } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectSelf, selectAllFoes } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

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
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 10;
		changeStagger(targets, "elementMatchFoe");
		const poisonedTargets = addModifier(targets, { name: "Poison", stacks: isCrit ? 4 : 2 });
		return `${dealDamage(targets, user, damage, false, user.element, adventure)} ${joinAsStatement(false, getNames(poisonedTargets, adventure), "is", "are", "Poisoned.")}`;
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "Neurotoxin Strike"
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
		const addedEvade = addModifier([user], { name: "Evade", stacks }).length > 0;
		changeStagger([user], "elementMatchAlly");
		if (addedEvade) {
			return "It's prepared to Evade.";
		} else {
			return "But nothing happened.";
		}
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: "Sting"
}).addAction({
	name: "Neurotoxin Strike",
	element: "Earth",
	description: `Inflict ${getEmoji("Earth")} damage and Paralysis on a single foe`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 40;
		changeStagger(targets, "elementMatchFoe");
		const paralyzedTargets = addModifier(targets, { name: "Paralysis", stacks: isCrit ? 5 : 3 });
		return `${dealDamage(targets, user, damage, false, user.element, adventure)} ${joinAsStatement(false, getNames(paralyzedTargets, adventure), "is", "are", "Paralyzed.")}`;
	},
	selector: selectRandomFoe,
	needsLivingTargets: true,
	next: "Self-Destruct"
}).addAction({
	name: "Self-Destruct",
	element: "Earth",
	description: `Sacrifice self to deal large ${getEmoji("Earth")} damage to all foes`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 125;
		if (isCrit) {
			damage *= 2;
		}
		user.hp = 0;
		changeStagger(targets, "elementMatchFoe");

		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "Barrel Roll"
});

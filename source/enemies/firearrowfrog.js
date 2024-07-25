const { EnemyTemplate } = require("../classes");
const { getModifierEmoji } = require("../modifiers/_modifierDictionary.js");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, getNames } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

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
	description: `Inflict minor ${getEmoji("Fire")} damage and ${getModifierEmoji("Poison")} on a single foe`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const poisonedTargets = addModifier(targets, { name: "Poison", stacks: isCrit ? 6 : 3 });
		let damage = user.getPower() + 20;
		return `${joinAsStatement(true, getNames(poisonedTargets, adventure), "is", "are", "Poisoned.")} ${dealDamage(targets, user, damage, false, user.element, adventure)}`;
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random"
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
	next: "Venom Cannon"
}).addAction({
	name: "Goop Spray",
	element: "Untyped",
	description: "Slow a single foe",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const slowedTargets = addModifier(targets, { name: "Slow", stacks: isCrit ? 3 : 2 });
		if (isCrit) {
			addStagger(targets, "elementMatchFoe");
		}
		if (slowedTargets.length > 0) {
			return `${joinAsStatement(false, getNames(slowedTargets, adventure), "is", "are", "Slowed")}.`;
		} else {
			return "But nothing happened.";
		}
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "Venom Cannon"
});

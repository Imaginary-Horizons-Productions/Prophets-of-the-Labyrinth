const { EnemyTemplate } = require("../classes");
const { selectRandomFoe } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, getNames } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil.js");

module.exports = new EnemyTemplate("@{adventureOpposite} Ooze",
	"@{adventureOpposite}",
	200,
	90,
	"n*2+4",
	0,
	"Goop Spray",
	false
).addAction({
	name: "Goop Spray",
	element: "Untyped",
	description: "Inflict @e{Slow} on a single foe",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const slowedTargets = addModifier(targets, { name: "Slow", stacks: 3 });
		if (isCrit) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (slowedTargets.length > 0) {
			return joinAsStatement(false, getNames(slowedTargets, adventure), "is", "are", "Slowed.");
		} else {
			return "But nothing happened.";
		}
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random"
}).addAction({
	name: "Tackle",
	element: "@{adventureOpposite}",
	description: "Deal the Ooze's element damage to a single foe",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 25;
		if (isCrit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random"
})
	.setFlavorText({ name: "Ooze's Element", value: "The Ooze's element will be the opposite of the current adventure." });

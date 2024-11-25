const { EnemyTemplate } = require("../classes");
const { ELEMENT_MATCH_STAGGER_FOE } = require("../constants.js");
const { selectRandomFoe } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

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
	effect: (targets, user, adventure) => {
		if (user.crit) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Slow", stacks: 3 })));
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Tackle",
	element: "@{adventureOpposite}",
	description: "Deal the Ooze's element damage to a single foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 25;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	next: "random"
})
	.setFlavorText({ name: "Ooze's Element", value: "The Ooze's element will be the opposite of the current adventure." });

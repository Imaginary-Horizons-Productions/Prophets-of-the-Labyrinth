const { EnemyTemplate } = require("../classes");
const { ELEMENT_MATCH_STAGGER_FOE } = require("../constants.js");
const { selectRandomFoe } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

module.exports = new EnemyTemplate("@{adventure} Slime",
	"@{adventure}",
	200,
	90,
	"n*2+4",
	0,
	"Tackle",
	false
).addAction({
	name: "Tackle",
	element: "@{adventure}",
	description: "Deal the Slime's element damage to a single foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 25;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, adventure.element, adventure);
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Goop Spray",
	element: "Untyped",
	description: "Inflict @e{Slow} on a single foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		if (user.crit) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Slow", stacks: user.crit ? 3 : 2 })));
	},
	selector: selectRandomFoe,
	next: "random"
})
	.setFlavorText({ name: "Slime's Element", value: "The Slime's element will match the current adventure." });

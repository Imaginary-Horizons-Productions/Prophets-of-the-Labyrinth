const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");
const { selectRandomFoe } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

module.exports = new EnemyTemplate("Slime",
	"@{adventure}",
	200,
	90,
	"n*2+4",
	0,
	"Tackle",
	false
).addAction({
	name: "Tackle",
	essence: "@{adventure}",
	description: "Deal damage of the Slime's essence to a foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 25;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, adventure.essence, adventure).resultLines;
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Goop Spray",
	essence: "Unaligned",
	description: "Inflict @e{Torpidity} on a foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		if (user.crit) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Torpidity", stacks: user.crit ? 3 : 2 })));
	},
	selector: selectRandomFoe,
	next: "random"
})
	.setFlavorText({ name: "Slime's Essence", value: "The Slime's essence will match the current adventure." });

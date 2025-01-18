const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");
const { selectRandomFoe } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

module.exports = new EnemyTemplate("Ooze",
	"@{adventureOpposite}",
	200,
	90,
	"n*2+4",
	0,
	"Goop Spray",
	false
).addAction({
	name: "Goop Spray",
	essence: "Unaligned",
	description: "Inflict @e{Torpidity} on a foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		if (user.crit) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Torpidity", stacks: 3 })));
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Tackle",
	essence: "@{adventureOpposite}",
	description: "Deal damage of the Ooze's essence to a foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 25;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure);
	},
	selector: selectRandomFoe,
	next: "random"
})
	.setFlavorText({ name: "Ooze's Essence", value: "The Ooze's essence will be the opposite of the current adventure." });

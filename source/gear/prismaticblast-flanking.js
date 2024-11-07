const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Flanking Prismatic Blast",
	[
		["use", "Strike a foe and adjacent foes for @{damage} @{element} damage and @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, damage, critMultiplier, modifiers: [exposed] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure).concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, exposed))));
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setSidegrades("Distracting Prismatic Blast", "Vexing Prismatic Blast")
	.setModifiers({ name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(40);

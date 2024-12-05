const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Distracting Prismatic Blast",
	[
		["use", "Strike a foe and adjacent foes for @{damage} @{element} damage and @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, damage, critMultiplier, modifiers: [distracted] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure).concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, distracted))));
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setSidegrades("Flanking Prismatic Blast", "Vexing Prismatic Blast")
	.setModifiers({ name: "Distracted", stacks: 2 })
	.setCharges(15)
	.setDamage(40);

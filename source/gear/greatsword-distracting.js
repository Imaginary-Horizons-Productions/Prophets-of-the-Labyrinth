const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Distracting Greatsword",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on a foe and their adjacent allies"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier, modifiers: [distraction] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, distraction))));
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setSidegrades("Chaining Greatsword")
	.setCooldown(2)
	.setDamage(40)
	.setModifiers({ name: "Distraction", stacks: 2 });

const { GearTemplate } = require('../classes/index.js');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sharpened Abacus",
	[
		["use", "Deal <@{damage} + 5% target max HP> @{element} damage to a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		const resultLines = [];
		targets.forEach(target => {
			let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
			if (user.element === element) {
				changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
			}
			if (user.crit) {
				pendingDamage *= critMultiplier;
			}
			resultLines.push(...dealDamage([target], user, pendingDamage, false, element, adventure));
		})
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Thief's Abacus", "Unstoppable Abacus")
	.setCooldown(1)
	.setDamage(65);

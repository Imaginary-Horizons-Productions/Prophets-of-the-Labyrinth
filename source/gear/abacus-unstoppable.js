const { GearTemplate } = require('../classes/index.js');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Abacus",
	[
		["use", "Strike a foe for <@{damage} + 5% foe max HP> @{element} unblockable damage"],
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
			resultLines.push(...dealDamage([target], user, pendingDamage, true, element, adventure));
		})
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Thief's Abacus", "Sharpened Abacus")
	.setDurability(15)
	.setDamage(40);

const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Abacus",
	[
		["use", "Strike a foe for <@{damage} + 5% foe max HP> @{essence} unblockable damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier } = module.exports;
		const resultLines = [];
		targets.forEach(target => {
			let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
			if (user.essence === essence) {
				changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
			}
			if (user.crit) {
				pendingDamage *= critMultiplier;
			}
			resultLines.push(...dealDamage([target], user, pendingDamage, true, essence, adventure));
		})
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Thief's Abacus", "Sharpened Abacus")
	.setCooldown(1)
	.setDamage(40);

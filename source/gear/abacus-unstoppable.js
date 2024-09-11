const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Abacus",
	[
		["use", "Strike a foe for @{damage} (+5% foe max hp) @{element} unblockable damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let resultText = "";
		targets.forEach(target => {
			let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
			if (user.element === element) {
				changeStagger([target], "elementMatchFoe");
			}
			if (isCrit) {
				pendingDamage *= critMultiplier;
			}
			resultText += dealDamage([target], user, pendingDamage, true, element, adventure);
		})
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Thief's Abacus", "Sharpened Abacus")
	.setDurability(15)
	.setDamage(40);

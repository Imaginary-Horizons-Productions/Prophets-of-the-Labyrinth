const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sharpened Abacus",
	[
		["use", "Deal @{damage} (+5% foe max hp) @{element} damage to a foe"],
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
			resultText += dealDamage([target], user, pendingDamage, false, element, adventure);
		})
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Thief's Abacus", "Unstoppable Abacus")
	.setDurability(15)
	.setDamage(65);

const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Abacus",
	"Deal @{damage} (+5% foe max hp) @{element} damage to a foe",
	"Damage x@{critMultiplier}",
	"Trinket",
	"Water",
	200,
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
	.setUpgrades("Hunter's Abacus", "Sharpened Abacus", "Unstoppable Abacus")
	.setDurability(15)
	.setDamage(40);

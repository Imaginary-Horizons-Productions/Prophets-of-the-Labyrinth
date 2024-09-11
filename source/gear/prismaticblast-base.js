const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Prismatic Blast",
	[
		["use", "Strike a foe and adjacent foes for @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe", needsLivingTargets: true })
	.setUpgrades("Distracting Prismatic Blast", "Vexing Prismatic Blast")
	.setDurability(15)
	.setDamage(40);

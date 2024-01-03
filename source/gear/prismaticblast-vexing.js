const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Vexing Prismatic Blast",
	"Strike a foe and adjacent foes for @{damage} @{element} damage (+@{bonus} if target has any debuffs)",
	"Damage x@{critMultiplier}",
	"Spell",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			targets.forEach(target => {
				target.addStagger("elementMatchFoe");
			})
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ target: `blast${SAFE_DELIMITER}1`, team: "foe", needsLivingTargets: true })
	.setDurability(15)
	.setBonus(50) // vexing damage
	.setDamage(40);

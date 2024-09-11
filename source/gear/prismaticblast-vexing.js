const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Vexing Prismatic Blast",
	[
		["use", "Strike a foe and adjacent foes for @{damage} @{element} damage (+@{bonus} if target has any debuffs)"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier, bonus } = module.exports;
		let debuffedDamage = user.getPower() + damage + bonus;
		let nonDebuffedDamage = user.getPower() + damage;
		const debuffedTargets = [];
		const nondebuffedTargets = [];
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		targets.forEach(target => {
			if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
				debuffedTargets.push(target);
			} else {
				nondebuffedTargets.push(target);
			}
		})
		if (isCrit) {
			debuffedDamage *= critMultiplier;
			nonDebuffedDamage *= critMultiplier;
		}
		if (debuffedTargets.length > 0 && nondebuffedTargets.length > 0) {
			return `${dealDamage(debuffedTargets, user, debuffedDamage, false, element, adventure)} ${dealDamage(nondebuffedTargets, user, nonDebuffedDamage, false, element, adventure)}`;
		} else if (debuffedTargets.length > 0) {
			return dealDamage(debuffedTargets, user, debuffedDamage, false, element, adventure);
		} else {
			return dealDamage(nondebuffedTargets, user, nonDebuffedDamage, false, element, adventure);
		}
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Distracting Prismatic Blast")
	.setDurability(15)
	.setBonus(50) // vexing damage
	.setDamage(40);

const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Vexing Prismatic Blast",
	[
		["use", "Strike a foe and adjacent foes for <@{damage} + @{bonus} if target has any debuffs> @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, damage, critMultiplier, bonus } = module.exports;
		let debuffedDamage = user.getPower() + damage + bonus;
		let nonDebuffedDamage = user.getPower() + damage;
		const debuffedTargets = [];
		const nondebuffedTargets = [];
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		targets.forEach(target => {
			if (Object.keys(target.modifiers).some(modifier => getModifierCategory(modifier) === "Debuff")) {
				debuffedTargets.push(target);
			} else {
				nondebuffedTargets.push(target);
			}
		})
		if (user.crit) {
			debuffedDamage *= critMultiplier;
			nonDebuffedDamage *= critMultiplier;
		}
		if (debuffedTargets.length > 0 && nondebuffedTargets.length > 0) {
			return dealDamage(debuffedTargets, user, debuffedDamage, false, element, adventure).concat(dealDamage(nondebuffedTargets, user, nonDebuffedDamage, false, element, adventure));
		} else if (debuffedTargets.length > 0) {
			return dealDamage(debuffedTargets, user, debuffedDamage, false, element, adventure);
		} else {
			return dealDamage(nondebuffedTargets, user, nonDebuffedDamage, false, element, adventure);
		}
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setSidegrades("Distracting Prismatic Blast", "Flanking Prismatic Blast")
	.setDurability(15)
	.setBonus(50) // vexing damage
	.setDamage(40);

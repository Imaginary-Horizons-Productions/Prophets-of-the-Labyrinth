const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Sweeping Spear",
	[
		["use", "Strike all foes for @{damage} @{element} damage"],
		["Critical💥", "Also inflict @{foeStagger}"]
	],
	"Weapon",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, stagger, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.element === element) {
				changeStagger(stillLivingTargets, "elementMatchFoe");
			}
			if (isCrit) {
				changeStagger(stillLivingTargets, stagger);
				resultLines.push(joinAsStatement(false, getNames(stillLivingTargets, adventure), "was", "were", "Staggered."));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Spear", "Reactive Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40);

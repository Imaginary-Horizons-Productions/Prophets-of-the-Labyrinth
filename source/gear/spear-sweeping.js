const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Sweeping Spear",
	[
		["use", "Strike all foes for @{damage} @{element} damage"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Weapon",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { element, stagger, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			let pendingStagger = 0;
			if (user.element === element) {
				pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
			}
			if (user.crit) {
				pendingStagger += stagger;
				resultLines.push(joinAsStatement(false, stillLivingTargets.map(target => target.name), "was", "were", "Staggered."));
			}
			if (pendingStagger > 0) {
				changeStagger(stillLivingTargets, user, pendingStagger);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "all", team: "foe" })
	.setSidegrades("Lethal Spear", "Reactive Spear")
	.setStagger(2)
	.setCooldown(1)
	.setDamage(40);

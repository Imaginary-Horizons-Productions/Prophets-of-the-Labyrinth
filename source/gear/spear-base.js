const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Spear",
	[
		["use", "Strike a foe for @{damage} @{element} damage"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Weapon",
	"Earth",
	200,
	(targets, user, adventure) => {
		const { element, bonus, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingStagger = 0;
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (user.crit & stillLivingTargets.length > 0) {
			pendingStagger += bonus;
			resultLines.push(joinAsStatement(false, stillLivingTargets.map(target => target.name), "was", "were", "Staggered."));
		}
		if (pendingStagger > 0) {
			changeStagger(stillLivingTargets, user, pendingStagger);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Lethal Spear", "Reactive Spear", "Sweeping Spear")
	.setBonus(2) // Crit Stagger
	.setCooldown(1)
	.setDamage(65);

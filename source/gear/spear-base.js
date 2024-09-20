const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Spear",
	[
		["use", "Strike a foe for @{damage} @{element} damage"],
		["Critical💥", "Inflict @{stagger} more Stagger"]
	],
	"Weapon",
	"Earth",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, bonus, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (isCrit & stillLivingTargets.length > 0) {
			changeStagger(stillLivingTargets, bonus);
			resultLines.push(joinAsStatement(false, getNames(stillLivingTargets, adventure), "was", "were", "Staggered."));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Lethal Spear", "Reactive Spear", "Sweeping Spear")
	.setBonus(2) // Crit Stagger
	.setDurability(15)
	.setDamage(65);

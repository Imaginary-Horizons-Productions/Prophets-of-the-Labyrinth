const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Spear",
	"Strike a foe for @{damage} @{element} damage",
	"Also inflict @{foeStagger}",
	"Weapon",
	"Earth",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, stagger, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		let resultText = dealDamage(targets, user, pendingDamage, false, element, adventure);
		if (isCrit) {
			changeStagger(targets, stagger);
			resultText += ` ${joinAsStatement(false, getNames(targets, adventure), "was", "were", "Staggered.")}`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Lethal Spear", "Reactive Spear", "Sweeping Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(65);

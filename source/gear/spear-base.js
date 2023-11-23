const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Spear",
	"Strike a foe for @{damage} @{element} damage",
	"Also inflict @{stagger}",
	"Weapon",
	"Wind",
	200,
	([target], user, isCrit, adventure) => {
		const { element, stagger, damage } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		let resultText = dealDamage([target], user, damage, false, element, adventure);
		if (isCrit) {
			target.addStagger(stagger);
			resultText += ` ${target.getName(adventure.room.enemyIdMap)} is Staggered.`;
		}
		return resultText;
	}
).setTargetingTags({ target: "single", team: "foe" })
	.setUpgrades("Lethal Spear", "Reactive Spear", "Sweeping Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(100);

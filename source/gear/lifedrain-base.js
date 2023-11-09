const { GearTemplate } = require('../classes');
const { dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Life Drain",
	"Strike a foe for @{damage} @{element} damage, then gain @{healing} hp",
	"Healing x@{critBonus}",
	"Spell",
	"Darkness",
	200,
	([target], user, isCrit, adventure) => {
		let { element, damage, healing, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			healing *= critBonus;
		}
		return `${dealDamage([target], user, damage, false, element, adventure)} ${gainHealth(user, healing, adventure)}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Flanking Life Drain", "Reactive Life Drain", "Urgent Life Drain")
	.setDurability(15)
	.setDamage(75)
	.setHealing(25);

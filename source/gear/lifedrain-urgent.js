const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Urgent Life Drain",
	"Strike a foe for @{damage} @{element} damage, then gain @{healing} hp with priority",
	"Healing x@{critBonus}",
	"Spell",
	"Darkness",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, damage, healing, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			healing *= critBonus;
		}
		return `${dealDamage([target], user, damage, false, element, adventure)} ${gainHealth(user, healing, adventure)}`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Flanking Life Drain", "Reactive Life Drain")
	.setDurability(15)
	.setDamage(75)
	.setHealing(25)
	.setPriority(1);

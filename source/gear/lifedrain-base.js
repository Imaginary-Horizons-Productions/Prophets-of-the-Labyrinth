const { GearTemplate } = require('../classes');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Life Drain",
	"Strike a foe for @{damage} @{element} damage, then gain @{healing} hp",
	"Healing x@{critMultiplier}",
	"Spell",
	"Darkness",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, damage, healing, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${gainHealth(user, pendingHealing, adventure)}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Flanking Life Drain", "Reactive Life Drain", "Urgent Life Drain")
	.setDurability(15)
	.setDamage(40)
	.setHealing(25);

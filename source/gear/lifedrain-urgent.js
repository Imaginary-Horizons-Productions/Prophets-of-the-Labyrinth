const { GearTemplate } = require('../classes');
const { dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Urgent Life Drain",
	"Strike a foe for @{damage} @{element} damage, then gain @{healing} hp with priority",
	"Healing x@{critMultiplier}",
	"Spell",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, damage, healing, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		return `${dealDamage([target], user, damage, false, element, adventure)} ${gainHealth(user, pendingHealing, adventure)}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Life Drain", "Reactive Life Drain")
	.setDurability(15)
	.setDamage(40)
	.setHealing(25)
	.setPriority(1);

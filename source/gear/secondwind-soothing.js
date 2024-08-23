const { GearTemplate } = require('../classes');
const { gainHealth, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Soothing Second Wind",
	"Regain @{healing} hp and gain @{mod0Stacks} @{mod0}.",
	"Healing x@{critMultiplier}",
	"Technique",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { healing, element, critMultiplier } = module.exports;
		let pendingHealing = healing;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		return gainHealth(user, pendingHealing, adventure);
	}
).setTargetingTags({ type: "self", team: "none", needsLivingTargets: true })
	.setSidegrades("Cleansing Second Wind", "Lucky Second Wind")
	.setDurability(15)
	.setHealing(45)
	.setModifiers({ name: "Regen", stacks: 2 });

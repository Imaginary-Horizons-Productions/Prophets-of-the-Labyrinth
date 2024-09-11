const { GearTemplate } = require('../classes');
const { gainHealth, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Soothing Second Wind",
	[
		["use", "Regain @{damage} hp and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, critMultiplier } = module.exports;
		let pendingHealing = user.getPower();
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
	.setDurability(10)
	.setDamage(0)
	.setModifiers({ name: "Regen", stacks: 2 });

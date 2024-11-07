const { GearTemplate } = require('../classes');
const { gainHealth, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lucky Second Wind",
	[
		["use", "Regain @{damage} HP and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	350,
	(targets, user, adventure) => {
		const { element, critMultiplier, modifiers: [lucky] } = module.exports;
		let pendingHealing = user.getPower();
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		return [gainHealth(user, pendingHealing, adventure), ...generateModifierResultLines(addModifier([user]), lucky)];
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Cleansing Second Wind", "Soothing Second Wind")
	.setModifiers({ name: "Lucky", stacks: 1 })
	.setDurability(10)
	.setDamage(0);

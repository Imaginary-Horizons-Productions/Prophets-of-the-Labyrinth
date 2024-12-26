const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { gainHealth, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Balanced Second Wind",
	[
		["use", "Regain @{damage} HP and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Unaligned",
	350,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [finesse] } = module.exports;
		let pendingHealing = user.getPower();
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		return [gainHealth(user, pendingHealing, adventure), ...generateModifierResultLines(addModifier([user]), finesse)];
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Cleansing Second Wind", "Soothing Second Wind")
	.setModifiers({ name: "Finesse", stacks: 1 })
	.setCooldown(2)
	.setDamage(0);

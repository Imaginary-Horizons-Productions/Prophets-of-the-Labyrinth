const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants');
const { gainHealth, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Soothing Second Wind",
	[
		["use", "Regain @{damage} HP and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	350,
	(targets, user, adventure) => {
		const { element, critMultiplier, modifiers: [regen] } = module.exports;
		let pendingHealing = user.getPower();
		if (user.element === element) {
			changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		return [gainHealth(user, pendingHealing, adventure), ...generateModifierResultLines(addModifier([user], regen))];
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Cleansing Second Wind", "Lucky Second Wind")
	.setCooldown(2)
	.setDamage(0)
	.setModifiers({ name: "Regen", stacks: 2 });

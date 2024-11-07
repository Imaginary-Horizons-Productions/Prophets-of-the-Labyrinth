const { GearTemplate } = require('../classes');
const { changeStagger, addProtection, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lucky Scutum",
	[
		["use", "Grant @{protection} protection to an ally and yourself and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Fire",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([target, user], "elementMatchAlly");
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([target, user], pendingProtection);
		return [`${target.name} and ${user.name} gain protection.`, ...generateModifierResultLines(addModifier([user], lucky))];
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Guarding Scutum", "Sweeping Scutum")
	.setModifiers({ name: "Lucky", stacks: 1 })
	.setDurability(15)
	.setProtection(75);

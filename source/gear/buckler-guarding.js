const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection, generateModifierResultLines } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Guarding Buckler",
	[
		["use", "Grant an ally @{protection} protection and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [powerUp], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection(targets, pendingProtection);
		return [joinAsStatement(false, [user, ...targets].map(combatant => combatant.name), "gains", "gain", "protection."), ...generateModifierResultLines(addModifier([user], powerUp))];
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Accelerating Buckler", "Devoted Buckler")
	.setModifiers({ name: "Quicken", stacks: 4 })
	.setDurability(15)
	.setProtection(125);

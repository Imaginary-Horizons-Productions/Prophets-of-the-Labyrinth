const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection, generateModifierResultLines } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Reinforced Buckler",
	[
		["use", "Grant @{protection} protection to an ally and yourself and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([user, ...targets], "elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user, ...targets], pendingProtection);
		return [joinAsStatement(false, [user, ...targets].map(combatant => combatant.name), "gains", "gain", "protection."), ...generateModifierResultLines(addModifier([user], powerUp))];
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Devoted Buckler", "Guarding Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(75);

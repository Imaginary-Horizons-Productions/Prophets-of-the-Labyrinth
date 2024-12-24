const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
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
		const { essence, modifiers: [powerUp], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
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
	.setCooldown(1)
	.setProtection(125);

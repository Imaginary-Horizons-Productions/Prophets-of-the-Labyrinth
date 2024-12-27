const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { addModifier, changeStagger, addProtection, generateModifierResultLines } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Buckler",
	[
		["use", "Grant an ally @{protection} protection and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Light",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [swiftness], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection(targets, pendingProtection);
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection."), ...generateModifierResultLines(addModifier([user], swiftness))];
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Accelerating Buckler", "Devoted Buckler", "Guarding Buckler")
	.setModifiers({ name: "Swiftness", stacks: 4 })
	.setCooldown(1)
	.setProtection(75);

const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Poison Torrent",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on all foes"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	200,
	(targets, user, adventure) => {
		const { element, modifiers: [poison], critMultiplier } = module.exports;
		const pendingPoison = { ...poison };
		if (user.crit) {
			pendingPoison.stacks *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingPoison)));
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setUpgrades("Distracting Poison Torrent", "Harmful Poison Torrent", "Staggering Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDurability(15);

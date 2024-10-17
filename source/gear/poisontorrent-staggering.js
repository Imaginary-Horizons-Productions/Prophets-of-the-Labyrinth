const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Staggering Poison Torrent",
	[
		["use", "Inflict @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison], critMultiplier, stagger } = module.exports;
		const pendingPoison = { ...poison };
		if (isCrit) {
			pendingPoison.stacks *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		changeStagger(targets, stagger);
		return ["All foes were Staggered.", ...generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingPoison)))];
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Distracting Poison Torrent", "Harmful Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDurability(15)
	.setStagger(2);

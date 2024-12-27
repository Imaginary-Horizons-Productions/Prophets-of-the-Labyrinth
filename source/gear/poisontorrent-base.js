const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
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
		const { essence, modifiers: [poison], critMultiplier } = module.exports;
		const pendingPoison = { ...poison };
		if (user.crit) {
			pendingPoison.stacks *= critMultiplier;
		}
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingPoison)));
	}
).setTargetingTags({ type: "all", team: "foe" })
	.setUpgrades("Distracting Poison Torrent", "Harmful Poison Torrent", "Staggering Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setCharges(15)
	.setCooldown(0);

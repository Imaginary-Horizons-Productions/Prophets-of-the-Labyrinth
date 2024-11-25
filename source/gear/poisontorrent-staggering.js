const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Staggering Poison Torrent",
	[
		["use", "Inflict @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [poison], critMultiplier, stagger } = module.exports;
		const pendingPoison = { ...poison };
		let pendingStagger = stagger;
		if (user.crit) {
			pendingPoison.stacks *= critMultiplier;
		}
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		changeStagger(targets, user, pendingStagger);
		return ["All foes were Staggered.", ...generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingPoison)))];
	}
).setTargetingTags({ type: "all", team: "foe" })
	.setSidegrades("Distracting Poison Torrent", "Harmful Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDurability(15)
	.setStagger(2);

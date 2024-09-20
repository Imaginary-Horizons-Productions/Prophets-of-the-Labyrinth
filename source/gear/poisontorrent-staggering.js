const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { joinAsStatement } = require('../util/textUtil');

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
		const resultLines = ["All foes were Staggered."];
		const poisonedTargets = getNames(addModifier(targets, pendingPoison), adventure);
		if (poisonedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, poisonedTargets, "gains", "gain", `${getApplicationEmojiMarkdown("Poison")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Distracting Poison Torrent", "Harmful Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDurability(15)
	.setStagger(2);

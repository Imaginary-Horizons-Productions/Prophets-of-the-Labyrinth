const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Poison Torrent",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on all foes"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison], critMultiplier } = module.exports;
		const pendingPoison = { ...poison };
		if (isCrit) {
			pendingPoison.stacks *= critMultiplier;
		}
		const poisonedTargets = addModifier(targets, pendingPoison);
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (poisonedTargets.length > 0) {
			return [joinAsStatement(false, poisonedTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Poison")}.`)];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setUpgrades("Distracting Poison Torrent", "Harmful Poison Torrent", "Staggering Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDurability(15);

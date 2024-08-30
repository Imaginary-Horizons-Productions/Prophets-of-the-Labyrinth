const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Distracting Poison Torrent",
	"Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on all foes",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison, distracted], critMultiplier } = module.exports;
		const pendingPoison = { ...poison };
		if (isCrit) {
			pendingPoison.stacks *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultSentences = [];
		const poisonedTargets = getNames(addModifier(targets, pendingPoison), adventure);
		if (poisonedTargets.length > 1) {
			resultSentences.push(joinAsStatement(false, poisonedTargets, "was", "were", "Poisoned."));
		}
		const distractedTargets = getNames(addModifier(targets, distracted), adventure);
		if (distractedTargets.length > 1) {
			resultSentences.push(joinAsStatement(false, distractedTargets, "is", "are", "Distracted."));
		}

		if (resultSentences.length > 0) {
			return resultSentences.join(" ");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Harmful Poison Torrent", "Staggering Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 }, { name: "Distracted", stacks: 2 })
	.setDurability(15);

const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Staggering Poison Torrent",
	"Inflict @{mod0Stacks} @{mod0}",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison], critMultiplier, stagger } = module.exports;
		const pendingPoison = { ...poison };
		if (isCrit) {
			pendingPoison.stacks *= critMultiplier;
		}
		const poisonedTargets = getNames(addModifier(targets, pendingPoison), adventure);
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		changeStagger(targets, stagger);
		return `All foes were Staggered.${poisonedTargets.length > 0 ? ` ${joinAsStatement(false, poisonedTargets, "was", "were", "Poisoned.")}` : ""}`;
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Distracting Poison Torrent", "Harmful Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDurability(15)
	.setStagger(2);

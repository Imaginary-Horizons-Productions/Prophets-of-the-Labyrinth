const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Poison Torrent",
	"Inflict @{mod0Stacks} @{mod0} on all foes",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison], critMultiplier } = module.exports;
		const pendingPoison = { ...poison };
		if (isCrit) {
			pendingPoison.stacks *= critMultiplier;
		}
		const poisonedTargets = [];
		targets.forEach(target => {
			const addedPoison = addModifier(target, pendingPoison);
			if (addedPoison) {
				poisonedTargets.push(target.getName(adventure.room.enemyIdMap));
			}
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
		})
		if (poisonedTargets.length > 1) {
			return `**${listifyEN(poisonedTargets)}** were Poisoned.`;
		} else if (poisonedTargets.length === 1) {
			return `**${poisonedTargets[0]}** was Poisoned.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setUpgrades("Harmful Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDurability(15);

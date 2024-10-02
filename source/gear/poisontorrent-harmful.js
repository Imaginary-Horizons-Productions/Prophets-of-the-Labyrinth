const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Harmful Poison Torrent",
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on all foes"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison], critMultiplier, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingPoison = poison;
		if (isCrit) {
			pendingPoison.stacks *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.element === element) {
				changeStagger(stillLivingTargets, "elementMatchFoe");
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(stillLivingTargets, pendingPoison))));
		}
		return resultLines;
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Distracting Poison Torrent", "Staggering Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDamage(15)
	.setDurability(15);

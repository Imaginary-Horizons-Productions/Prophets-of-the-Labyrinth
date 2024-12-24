const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Harmful Poison Torrent",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on all foes"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [poison], critMultiplier, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingPoison = poison;
		if (user.crit) {
			pendingPoison.stacks *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.essence === essence) {
				changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(stillLivingTargets, pendingPoison))));
		}
		return resultLines;
	}
).setTargetingTags({ type: "all", team: "foe" })
	.setSidegrades("Distracting Poison Torrent", "Staggering Poison Torrent")
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDamage(15)
	.setCharges(15);

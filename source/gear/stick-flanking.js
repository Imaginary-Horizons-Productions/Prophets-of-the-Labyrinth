const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, combineModifierReceipts, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Flanking Stick",
	[
		["use", "Inflict @{damage} @{essence} damage, @{mod0Stacks} @{mod0}, and @{mod1Stacks} @{mod1} on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Earth",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [impotence, exposure] } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(stillLivingTargets, impotence), addModifier(stillLivingTargets, exposure))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Impotence", stacks: 3 }, { name: "Exposure", stacks: 2 });

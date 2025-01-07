const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Staggering Flourish",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Darkness",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [distraction], stagger } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE + stagger);
		return resultLines.concat(generateModifierResultLines(addModifier(stillLivingTargets, distraction)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Distraction", stacks: 3 })
	.setStagger(2);

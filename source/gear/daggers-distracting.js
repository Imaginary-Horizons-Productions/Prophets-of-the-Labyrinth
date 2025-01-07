const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Distracting Daggers",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod1Stacks} @{mod1} on a single foe and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Fire",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [excellence, distraction] } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier([user], excellence).concat(addModifier(targets, distraction)))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Distraction", stacks: 2 });

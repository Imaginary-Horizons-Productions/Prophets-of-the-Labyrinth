const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Bouncing Flourish",
	[
		["use", `Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on ${bounceCount} random foes`],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Darkness",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [distraction] } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(addModifier(stillLivingTargets, distraction)));
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Distraction", stacks: 3 });

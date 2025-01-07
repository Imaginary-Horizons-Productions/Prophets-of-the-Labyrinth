const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { gainHealth, dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Fatiguing Life Drain",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on a single foe and regain @{healing} HP"],
		["Critical💥", "Healing x @{critMultiplier}"]
	],
	"Action",
	"Darkness",
	0,
	(targets, user, adventure) => {
		const { essence, healing, critMultiplier, modifiers: [impotence] } = module.exports;
		let pendingHealing = healing;
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, user.getPower(), false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(addModifier(stillLivingTargets, impotence)), gainHealth(user, pendingHealing, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setHealing(25)
	.setModifiers({ name: "Impotence", stacks: 3 });

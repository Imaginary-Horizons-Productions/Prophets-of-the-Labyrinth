const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addProtection, addModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { protectionScalingGenerator, archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Accelerating Lance",
	[
		["use", "Gain <@{protection}> protection and @{mod0Stacks} @{mod0}, then deal <@{damage}> @{essence} damage to a foe"],
		["Critical💥", "Protection x @{critBonus}"]
	],
	"Action",
	"Water"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, protection, critBonus }, modifiers: [swiftness] } = module.exports;
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(`${user.name} gains protection.`, generateModifierResultLines(addModifier([user], swiftness)));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		protection: protectionScalingGenerator(25)
	})
	.setModifiers({ name: "Swiftness", stacks: 3 });

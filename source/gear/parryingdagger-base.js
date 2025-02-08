const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Parrying Dagger",
	[
		["use", "Gain <@{protection}> protection and @{mod0Stacks} @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Light"
).setCost(200)
	.setEffect(
		(targets, user, adventure) => {
			const { essence, modifiers: [finesse], scalings: { critBonus, protection } } = module.exports;
			if (user.essence === essence) {
				changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
			}
			const pendingFinesse = { ...finesse };
			if (user.crit) {
				pendingFinesse.stacks *= critBonus;
			}
			addProtection([user], protection.calculate(user));
			return [`${user.name} gains protection.`].concat(generateModifierResultLines(addModifier([user], pendingFinesse)));
		}, { type: "self", team: "ally" })
	.setUpgrades("Devoted Parrying Dagger", "Hastening Parrying Dagger")
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 });

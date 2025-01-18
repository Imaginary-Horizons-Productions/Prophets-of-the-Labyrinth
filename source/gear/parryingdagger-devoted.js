const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Devoted Parrying Dagger",
	[
		["use", "Grant an ally <@{protection}> protection and @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [finesse], scalings: { critBonus, protection } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingFinesse = { ...finesse };
		if (user.crit) {
			pendingFinesse.stacks *= critBonus;
		}
		addProtection(targets, protection.calculate(user));
		return [`${targets[0].name} gains protection.`].concat(generateModifierResultLines(addModifier(targets, pendingFinesse)));
	}, { type: "single", team: "ally" })
	.setSidegrades("Hastening Parrying Dagger")
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 });

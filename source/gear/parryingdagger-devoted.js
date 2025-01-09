const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Devoted Parrying Dagger",
	[
		["use", "Grant an ally @{protection} protection and @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Defense",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [finesse], critMultiplier, protection } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingFinesse = { ...finesse };
		if (user.crit) {
			pendingFinesse.stacks *= critMultiplier;
		}
		addProtection(targets, protection + Math.floor(user.getBonusHP() / 5));
		return [`${targets[0].name} gains protection.`].concat(generateModifierResultLines(addModifier(targets, pendingFinesse)));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Hastening Parrying Dagger")
	.setCooldown(1)
	.setProtection(75)
	.setModifiers({ name: "Finesse", stacks: 1 });

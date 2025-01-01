const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Parrying Dagger",
	[
		["use", "Gain @{protection} protection and @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Defense",
	"Light",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [finesse], critMultiplier, protection } = module.exports;
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingFinesse = { ...finesse };
		if (user.crit) {
			pendingFinesse.stacks *= critMultiplier;
		}
		addProtection([user], protection + Math.floor(user.getBonusHP() / 5));
		return [`${user.name} gains protection.`].concat(generateModifierResultLines(addModifier([user], pendingFinesse)));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setUpgrades("Devoted Parrying Dagger", "Hastening Parrying Dagger")
	.setCooldown(1)
	.setProtection(75)
	.setModifiers({ name: "Finesse", stacks: 1 });

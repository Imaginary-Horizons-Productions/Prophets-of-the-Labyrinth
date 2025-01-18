const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Accelerating Midas Staff",
	[
		["use", "Grant @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to a combatant"],
		["Critical💥", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [curseOfMidas, swiftness], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, targets[0].team === user.team ? ESSENCE_MATCH_STAGGER_ALLY : ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingCurse = { ...curseOfMidas };
		if (user.crit) {
			pendingCurse.stacks += critBonus;
		}
		return generateModifierResultLines(addModifier(targets, pendingCurse).concat(addModifier(targets, swiftness)));
	}, { type: "single", team: "any" })
	.setSidegrades("Discounted Midas Staff")
	.setCooldown(1)
	.setModifiers({ name: "Curse of Midas", stacks: 2 }, { name: "Swiftness", stacks: 3 })
	.setScalings({ critBonus: 1 });

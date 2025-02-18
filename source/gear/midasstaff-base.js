const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Midas Staff",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a combatant"],
		["critical", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Light"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [curseOfMidas], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, targets[0].team === user.team ? ESSENCE_MATCH_STAGGER_ALLY : ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingCurse = { ...curseOfMidas };
		if (user.crit) {
			pendingCurse.stacks += critBonus;
		}
		return generateModifierResultLines(addModifier(targets, pendingCurse));
	}, { type: "single", team: "any" })
	.setUpgrades("Accelerating Midas Staff", "Discounted Midas Staff")
	.setCooldown(1)
	.setModifiers({ name: "Curse of Midas", stacks: 2 })
	.setScalings({ critBonus: 1 });

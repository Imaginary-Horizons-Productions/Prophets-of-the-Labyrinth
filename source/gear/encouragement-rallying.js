const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier, concatTeamMembersWithModifier } = require('../util/combatantUtil');
const { scalingExcellence, scalingEmpowerment } = require('./shared/modifiers');

module.exports = new GearTemplate("Rallying Encouragement",
	[
		["use", "Grant <@{mod0Stacks}> @{mod0} and <@{mod1Stacks}> @{mod1} to an ally and all allies with @{mod2}"],
		["Critical💥", "@{mod0} and @{mod1} x @{critBonus}"]
	],
	"Spell",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [excellence, empowerment, targetModifier], scalings: { critBonus } } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
		if (user.essence === essence) {
			changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingExcellence = { name: excellence.name, stacks: excellence.stacks.calculate(user) };
		const pendingEmpowerment = { name: empowerment.name, stacks: empowerment.stacks.calculate(user) };
		if (user.crit) {
			pendingExcellence.stacks *= critBonus;
			pendingEmpowerment.stacks *= critBonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, pendingExcellence).concat(addModifier(allTargets, pendingEmpowerment))));
	}, { type: "single", team: "ally" })
	.setSidegrades("Vigorous Encouragement")
	.setCharges(15)
	.setModifiers(scalingExcellence(2), scalingEmpowerment(25), { name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

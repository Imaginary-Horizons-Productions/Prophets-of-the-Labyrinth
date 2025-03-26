const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, concatTeamMembersWithModifier, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { scalingExposure } = require('./shared/modifiers');

module.exports = new GearTemplate("Flanking War Cry",
	[
		["use", "Stagger and inflict <@{mod1Stacks}> @{mod1} on a foe and all foes with @{mod0}"],
		["critical", "Stagger x @{critBonus}"]
	],
	"Support",
	"Darkness",
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, stagger, scalings: { critBonus }, modifiers: [targetModifier, exposure] } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);

		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingStagger *= critBonus;
		}
		changeStagger(allTargets, user, pendingStagger);
		return [joinAsStatement(false, allTargets.map(target => target.name), "was", "were", "Staggered.")].concat(generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, { name: exposure.name, stacks: exposure.stacks.calculate(user) }))));
	}, { type: "single", team: "foe" })
	.setSidegrades("Weakening War Cry")
	.setCooldown(1)
	.setModifiers({ name: "Distraction", stacks: 0 }, scalingExposure(2))
	.setStagger(2)
	.setScalings({ critBonus: 2 });

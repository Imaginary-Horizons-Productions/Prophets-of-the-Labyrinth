const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, concatTeamMembersWithModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("War Cry",
	[
		["use", "Stagger a foe and all foes with @{mod0}"],
		["critical", "Stagger x @{critBonus}"]
	],
	"Support",
	"Darkness"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, stagger, scalings: { critBonus }, modifiers: [targetModifier] } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);

		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingStagger *= critBonus;
		}
		changeStagger(allTargets, user, pendingStagger);
		return [joinAsStatement(false, allTargets.map(allTargets.name), "was", "were", "Staggered.")];
	}, { type: "single", team: "foe" })
	.setUpgrades("Flanking War Cry", "Weakening Warcry")
	.setCooldown(1)
	.setModifiers({ name: "Distraction", stacks: 0 })
	.setStagger(2)
	.setScalings({ critBonus: 2 });

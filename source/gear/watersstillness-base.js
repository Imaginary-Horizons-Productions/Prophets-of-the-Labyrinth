const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { concatTeamMembersWithModifier, changeStagger } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Water's Stillness",
	[
		["use", "Relieve Stagger for an ally and all allies with @{mod0}"],
		["critical", "Stagger relieved x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [targetModifier], stagger, scalings: { critBonus } } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
		let pendingStaggerRelief = stagger;
		if (user.essence === essence) {
			pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
		}
		if (user.crit) {
			pendingStaggerRelief *= critBonus;
		}
		changeStagger(allTargets, user, pendingStaggerRelief);
		return [joinAsStatement(false, allTargets.map(target => target.name), "shrugs off", "shrug off", "some Stagger.")];
	}, { type: "single", team: "ally" })
	.setUpgrades("Accelerating Water's Stillness", "Cleansing Water's Stillness")
	.setCharges(15)
	.setStagger(-2)
	.setModifiers({ name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

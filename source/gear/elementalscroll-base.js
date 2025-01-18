const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, concatTeamMembersWithModifier, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Elemental Scroll",
	[
		["use", "Grant @{mod0Stacks} @{mod0} to an ally and allies with @{mod1}"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Support",
	"Fire"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [attunement, vigilance], scalings: { critBonus } } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, vigilance.name);
		if (user.essence === essence) {
			changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingAttunement = { ...attunement };
		if (user.crit) {
			pendingAttunement.stacks *= critBonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, pendingAttunement)));
	}, { type: "single", team: "ally" })
	.setUpgrades("Surpassing Elemental Scroll", "Balanced Elemental Scroll")
	.setCooldown(1)
	.setModifiers({ name: "Attunement", stacks: 3 }, { name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, payHP, changeStagger, addModifier, concatTeamMembersWithModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Opportunist's Tempestuous Wrath",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and deal @{damage} @{essence} damage to a single foe and all foes with @{mod1}"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Pact",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [empowerment, targetModifier], damage, critMultiplier } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);
		if (user.essence === essence) {
			changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = generateModifierResultLines(addModifier([user], { name: empowerment.name, stacks: empowerment.stacks.generator(user) }));
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return resultLines.concat(dealDamage(allTargets, user, pendingDamage, false, essence, adventure), payHP(user, user.modifiers.Empowerment, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Flanking Tempestuous Wrath")
	.setPactCost([0, "(Empowerment stacks) HP after move"])
	.setDamage(40)
	.setModifiers({
		name: "Empowerment",
		stacks: {
			description: "25 x (1 to 1.5 based on missing HP)", generator: (user) => {
				const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
				return 25 * furiousness;
			}
		}
	}, { name: "Distraction", stacks: 0 });

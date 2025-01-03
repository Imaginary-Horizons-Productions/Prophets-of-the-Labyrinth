const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, payHP, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Tempestuous Wrath",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and deal @{damage} @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Pact",
	"Wind",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [empowerment], damage, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = generateModifierResultLines(addModifier([user], { name: empowerment.name, stacks: empowerment.stacks.generator(user) }));
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return resultLines.concat(dealDamage(targets, user, pendingDamage, false, essence, adventure), payHP(user, user.modifiers.Empowerment, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Flanking Tempestuous Wrath", "Opportunist's Tempestuous Wrath")
	.setPactCost([0, "(Empowerment stacks) HP after move"])
	.setDamage(40)
	.setModifiers({
		name: "Empowerment", stacks: {
			description: "25 x (1 to 1.5 based on missing HP)", generator: (user) => {
				const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
				return 25 * furiousness;
			}
		}
	});

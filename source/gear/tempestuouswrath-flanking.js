const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, payHP, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Flanking Tempestuous Wrath",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and inflict @{damage} @{essence} damage and @{mod1Stacks} @{mod1} on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Pact",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [empowerment, exposure], damage, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = generateModifierResultLines(addModifier([user], { name: empowerment.name, stacks: empowerment.stacks.generator(user) }));
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return resultLines.concat(dealDamage(targets, user, pendingDamage, false, essence, adventure), generateModifierResultLines(addModifier(targets, exposure)), payHP(user, user.modifiers.Empowerment, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Opportunist's Tempestuous Wrath")
	.setPactCost([0, "(Empowerment stacks) HP after move"])
	.setDamage(40)
	.setModifiers({
		name: "Empowerment", stacks: {
			description: "25 x (1 to 1.5 based on missing HP)", generator: (user) => {
				const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
				return 25 * furiousness;
			}
		}
	}, { name: "Exposure", stacks: 2 });

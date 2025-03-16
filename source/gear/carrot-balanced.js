const { GearTemplate, CombatantReference } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { getPetMove } = require('../pets/_petDictionary');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { scalingRegeneration } = require('./shared/modifiers');
const base = require('./carrot-base.js')

module.exports = new GearTemplate("Balanced Carrot",
	[
		["use", "Grant <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1} to an ally and entice their pet to use its first move"],
		["critical", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Earth"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { modifiers: [finesse] } = module.exports;
		return base.effect([target], user, adventure, { extraReceipts: addModifier([target], finesse) });
	}, { type: "single", team: "ally" })
	.setSidegrades("Guarding Carrot")
	.setCooldown(1)
	.setModifiers({ name: "Finesse", stacks: 1 })
	.setScalings({ critBonus: 1 });

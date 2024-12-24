const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');
const { accuratePassive } = require('./descriptions/passives.js');

module.exports = new GearTemplate("Evasive Cloak",
	[
		accuratePassive,
		["use", "Gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Armor",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [evade], bonus } = module.exports;
		const pendingEvade = { ...evade };
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingEvade.stacks += bonus;
		}
		return generateModifierResultLines(addModifier([user], pendingEvade));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Accelerating Cloak", "Accurate Cloak")
	.setModifiers({ name: "Evade", stacks: 3 })
	.setBonus(1) // Evade stacks
	.setCritRate(5)
	.setCooldown(1);

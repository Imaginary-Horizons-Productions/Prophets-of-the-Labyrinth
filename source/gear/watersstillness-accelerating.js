const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { concatTeamMembersWithModifier, changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Accelerating Water's Stillness",
	[
		["use", "Relieve Stagger and grant @{mod1Stacks} @{mod1} to a single ally and all allies with @{mod0}"],
		["Critical💥", "Stagger relieved x @{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [targetModifier, swiftness], stagger, critMultiplier } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
		let pendingStaggerRelief = stagger;
		if (user.essence === essence) {
			pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
		}
		if (user.crit) {
			pendingStaggerRelief *= critMultiplier;
		}
		changeStagger(allTargets, user, pendingStaggerRelief);
		return [joinAsStatement(false, allTargets.map(target => target.name), "shrugs off", "shrug off", "some Stagger.")].concat(generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, { name: swiftness.name, stacks: swiftness.stacks.generator(user) }))));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Cleansing Water's Stillness")
	.setCharges(15)
	.setStagger(-2)
	.setModifiers({ name: "Vigilance", stacks: 0 }, { name: "Swiftness", stacks: { description: "2 + Bonus Speed ÷ 10", generator: (user) => 2 + Math.floor(user.getBonusSpeed() / 10) } });

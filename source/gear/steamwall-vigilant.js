const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Vigilant Steam Wall",
	[
		["use", "Grant <@{protection}> protection to and @{mod0Stacks} @{mod0} for an ally and adjacent allies"],
		["Critical💥", "Protection x @{critBonus}"]
	],
	"Maneuver",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, moraleRequirement, scalings: { protection, critBonus }, modifiers: [vigilance] } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		let pendingProtection = protection.calculate(user);
		if (user.crit) {
			pendingProtection *= critBonus;
		}
		addProtection(targets, pendingProtection);
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection.")].concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, vigilance))));
	}, { type: `blast${SAFE_DELIMITER}1`, team: "ally" })
	.setSidegrades("Supportive Steam Wall")
	.setMoraleRequirement(1)
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2
	})
	.setModifiers({ name: "Vigilance", stacks: 2 });

const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Vigilant Conjured Ice Armaments",
	[
		["use", "Grant @{protection} protection to and @{mod0Stacks} @{mod0} for an ally and adjacent allies"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Maneuver",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, protection, critMultiplier, modifiers: [vigilance] } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough Morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		let pendingProtection = protection + Math.floor(user.getBonusHP() / 5);
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection(targets, pendingProtection);
		return [joinAsStatement(false, targets.map(target => target.name), "gain", "gains", "protection.")].concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, vigilance))));
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "ally" })
	.setSidegrades("Supportive Conjured Ice Armaments")
	.setMoraleRequirement(1)
	.setProtection(125)
	.setModifiers({ name: "Vigilance", stacks: 2 });

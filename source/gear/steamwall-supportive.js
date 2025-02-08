const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Supportive Steam Wall",
	[
		["use", "Grant <@{protection}> protection to and relieve @{staggerRelief} Stagger for an ally and adjacent allies"],
		["critical", "Protection x @{critBonus}"]
	],
	"Maneuver",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, moraleRequirement, scalings: { protection, critBonus, staggerRelief } } = module.exports;
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
		changeStagger(targets, user, staggerRelief);
		const targetNames = targets.map(target => target.name);
		return [joinAsStatement(false, targetNames, "gains", "gain", "protection."), joinAsStatement(false, targetNames, "is", "are", "relieved of Stagger.")];
	}, { type: `blast${SAFE_DELIMITER}1`, team: "ally" })
	.setSidegrades("Vigilant Steam Wall")
	.setMoraleRequirement(1)
	.setScalings({
		protection: protectionScalingGenerator(125),
		critBonus: 2,
		staggerRelief: 2
	});

const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Supportive Conjured Ice Armaments",
	[
		["use", "Grant @{protection} protection to and relieve @{bonus} Stagger for an ally and adjacent allies"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Maneuver",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, protection, critMultiplier, bonus } = module.exports;
		if (adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough Morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		let pendingProtection = protection + Math.floor(user.getMaxHP() / 5);
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection(targets, pendingProtection);
		changeStagger(targets, user, bonus);
		const targetNames = targets.map(target => target.name);
		return [joinAsStatement(false, targetNames, "gain", "gains", "protection."), joinAsStatement(false, targetNames, "is", "are", "relieved of Stagger.")];
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "ally" })
	.setSidegrades("Vigilant Conjured Ice Armaments")
	.setMoraleRequirement(1)
	.setProtection(65)
	.setBonus(2); // Stagger relieved

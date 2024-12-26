const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Guarding Scutum",
	[
		["use", "Grant @{protection} protection to an ally and @{bonus} protection to yourself"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Fire",
	350,
	([target], user, adventure) => {
		const { essence, protection, bonus, critMultiplier } = module.exports;
		let selfProtection = bonus;
		let targetProtection = protection;
		if (user.essence === essence) {
			changeStagger([target, user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			selfProtection *= critMultiplier;
			targetProtection *= critMultiplier;
		}
		addProtection([target], targetProtection);
		addProtection([user], selfProtection);
		return [`${target.name} and ${user.name} gain protection.`];
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Balanced Scutum", "Sweeping Scutum")
	.setCooldown(1)
	.setProtection(100)
	.setBonus(75);

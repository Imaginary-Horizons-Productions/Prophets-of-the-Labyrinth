const { GearTemplate } = require('../classes');
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
		const { element, protection, bonus, critMultiplier } = module.exports;
		let selfProtection = bonus;
		let targetProtection = protection;
		if (user.element === element) {
			changeStagger([target, user], "elementMatchAlly");
		}
		if (user.crit) {
			selfProtection *= critMultiplier;
			targetProtection *= critMultiplier;
		}
		addProtection([target], targetProtection);
		addProtection([user], selfProtection);
		return [`${target.name} and ${user.name} gain protection.`];
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Lucky Scutum", "Sweeping Scutum")
	.setDurability(15)
	.setProtection(100)
	.setBonus(75);

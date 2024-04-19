const { GearTemplate } = require('../classes');
const { changeStagger, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Guarding Scutum",
	"Grant @{protection} protection to an ally and @{bonus} protection to yourself",
	"Protection x@{critMultiplier}",
	"Armor",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, protection, bonus, critMultiplier } = module.exports;
		let selfProtection = bonus;
		let targetProtection = protection;
		if (user.element === element) {
			changeStagger([target, user], "elementMatchAlly");
		}
		if (isCrit) {
			selfProtection *= critMultiplier;
			targetProtection *= critMultiplier;
		}
		addProtection([target], targetProtection);
		addProtection([user], selfProtection);
		return `${target.getName(adventure.room.enemyIdMap)} and ${user.getName(adventure.room.enemyIdMap)} gain protection.`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Sweeping Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setProtection(100)
	.setBonus(75);

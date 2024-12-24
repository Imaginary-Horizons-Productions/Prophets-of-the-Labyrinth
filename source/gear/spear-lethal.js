const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Lethal Spear",
	[
		["use", "Strike a foe for @{damage} @{essence} damage"],
		["Critical💥", "Damage x@{critMultiplier}, inflict @{bonus} more Stagger"]
	],
	"Weapon",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, bonus, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingStagger = 0;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
			pendingStagger += bonus;
		}
		if (pendingStagger > 0) {
			changeStagger(targets, user, pendingStagger);
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (targets.some(target => target.hp > 0)) {
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Reactive Spear", "Sweeping Spear")
	.setBonus(2) // Crit Stagger
	.setCooldown(1)
	.setDamage(65);

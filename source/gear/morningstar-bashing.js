const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Bashing Morning Star",
	[
		["use", "Strike a foe for <@{damage} + protection> @{essence} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, stagger, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage + user.protection;
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		changeStagger(targets, user, pendingStagger);
		return [...dealDamage(targets, user, pendingDamage, false, essence, adventure), joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered.")];
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Awesome Morning Star", "Hunter's Morning Star")
	.setStagger(2)
	.setCooldown(1)
	.setDamage(40);

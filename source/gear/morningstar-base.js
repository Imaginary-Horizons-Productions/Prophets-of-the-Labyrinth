const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Morning Star",
	[
		["use", "Strike a foe for @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Light",
	200,
	(targets, user, adventure) => {
		const { element, stagger, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingStagger = stagger;
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		changeStagger(targets, user, pendingStagger);
		return [...dealDamage(targets, user, pendingDamage, false, element, adventure), joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered.")];
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Awesome Morning Star", "Bashing Morning Star", "Hunter's Morning Star")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40);

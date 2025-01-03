const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Life Drain",
	[
		["use", "Strike a foe for @{damage} @{element} damage, then gain @{healing} HP"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Spell",
	"Darkness",
	200,
	(targets, user, adventure) => {
		const { element, damage, healing, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		return [...dealDamage(targets, user, pendingDamage, false, element, adventure), gainHealth(user, pendingHealing, adventure)];
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Flanking Life Drain", "Furious Life Drain", "Thirsting Life Drain")
	.setCharges(15)
	.setDamage(40)
	.setHealing(25);

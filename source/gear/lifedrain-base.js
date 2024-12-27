const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Life Drain",
	[
		["use", "Strike a foe for @{damage} @{essence} damage, then gain @{healing} HP"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Spell",
	"Darkness",
	200,
	(targets, user, adventure) => {
		const { essence, damage, healing, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		return [...dealDamage(targets, user, pendingDamage, false, essence, adventure), gainHealth(user, pendingHealing, adventure)];
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Flanking Life Drain", "Furious Life Drain", "Thirsting Life Drain")
	.setCharges(15)
	.setDamage(40)
	.setHealing(25)
	.setCooldown(0);

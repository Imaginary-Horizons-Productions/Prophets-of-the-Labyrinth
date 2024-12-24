const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Furious Life Drain",
	[
		["use", "Strike a foe for <@{damage} x 1 to 1.5 based on your missing HP> @{essence} damage, then gain @{healing} HP"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Spell",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, damage, healing, critMultiplier } = module.exports;
		const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
		let pendingDamage = (user.getPower() + damage) * furiousness;
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
	.setSidegrades("Flanking Life Drain", "Thirsting Life Drain")
	.setCharges(15)
	.setDamage(40)
	.setHealing(25); // gold

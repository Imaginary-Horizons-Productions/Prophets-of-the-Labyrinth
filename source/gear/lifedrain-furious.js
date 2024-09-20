const { GearTemplate } = require('../classes/index.js');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Furious Life Drain",
	[
		["use", "Strike a foe for @{damage} @{element} damage (increases with your missing HP), then gain @{healing} HP"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Spell",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, healing, critMultiplier } = module.exports;
		const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
		let pendingDamage = (user.getPower() + damage) * furiousness;
		let pendingHealing = healing;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		return [...dealDamage(targets, user, pendingDamage, false, element, adventure), gainHealth(user, pendingHealing, adventure)];
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Life Drain", "Thirsting Life Drain")
	.setDurability(15)
	.setDamage(40)
	.setHealing(25); // gold

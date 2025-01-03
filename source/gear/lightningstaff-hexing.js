const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Hexing Lightning Staff",
	[
		["use", `Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on ${bounceCount} random foes`],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Adventuring",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier, modifiers: [misfortune] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(addModifier(targets, misfortune));
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setUpgrades("Disenchanting Lightning Staff")
	.setCooldown(2)
	.setRnConfig({ foes: 3 })
	.setModifiers({ name: "Misfortune", stacks: 4 });

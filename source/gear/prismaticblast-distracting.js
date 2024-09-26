const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Distracting Prismatic Blast",
	[
		["use", "Strike a foe and adjacent foes for @{damage} @{element} damage and @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier, modifiers: [distracted] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure).concat(addModifier(targets, distracted));
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Prismatic Blast", "Vexing Prismatic Blast")
	.setModifiers({ name: "Distracted", stacks: 2 })
	.setDurability(15)
	.setDamage(40);

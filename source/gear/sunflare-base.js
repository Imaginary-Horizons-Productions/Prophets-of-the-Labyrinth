const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sun Flare",
	"Inflict @{stagger} on a foe with priority",
	"Also inflict @{mod0Stacks} @{mod0}",
	"Technique",
	"Light",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [slow], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			addModifier(target, slow);
		}
		target.addStagger(stagger)
		return `${target.getName(adventure.room.enemyIdMap)} is Staggered${isCrit ? " and Slowed" : ""}.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Accelerating Sun Flare", "Evasive Sun Flare", "Tormenting Sun Flare")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

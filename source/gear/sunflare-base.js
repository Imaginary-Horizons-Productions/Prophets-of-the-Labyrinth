const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sun Flare",
	"Inflict @{foeStagger} on a foe with priority",
	"Also inflict @{mod0Stacks} @{mod0}",
	"Technique",
	"Light",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], stagger } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		let addedSlow = false;
		if (isCrit) {
			addedSlow = addModifier([target], slow).length > 0;
		}
		changeStagger([target], stagger);
		return `${target.getName(adventure.room.enemyIdMap)} is Staggered${addedSlow ? " and Slowed" : ""}.`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Accelerating Sun Flare", "Evasive Sun Flare", "Tormenting Sun Flare")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

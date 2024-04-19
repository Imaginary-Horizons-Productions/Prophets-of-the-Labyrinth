const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Sun Flare",
	"Inflict @{foeStagger} on a foe, then gain @{mod0Stacks} @{mod0} with priority",
	"Also inflict @{mod1Stacks} @{mod1}",
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [quicken, slow], stagger } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		let addedSlow = false;
		if (isCrit) {
			addedSlow = addModifier([target], slow).length > 0;
		}
		changeStagger([target], stagger);
		const addedQuicken = addModifier([user], quicken).length > 0;
		return `${addedQuicken ? `${user.getName(adventure.room.enemyIdMap)} is Quickened. ` : ""}${target.getName(adventure.room.enemyIdMap)} is Staggered${addedSlow ? ` and Slowed` : ""}.`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Sun Flare", "Tormenting Sun Flare")
	.setModifiers({ name: "Quicken", stacks: 1 }, { name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

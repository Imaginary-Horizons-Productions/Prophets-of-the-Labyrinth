const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Sun Flare",
	"Inflict @{stagger} on a foe, then gain @{mod0Stacks} @{mod0} with priority",
	"Also inflict @{mod1Stacks} @{mod1}",
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [quicken, slow], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		let addedSlow = false;
		if (isCrit) {
			addedSlow = addModifier(target, slow);
		}
		target.addStagger(stagger);
		const addedQuicken = addModifier(user, quicken);
		return `${addedQuicken ? `${user.getName(adventure.room.enemyIdMap)} is Quickened. ` : ""}${target.getName(adventure.room.enemyIdMap)} is Staggered${addedSlow ? ` and Slowed` : ""}.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Sun Flare", "Tormenting Sun Flare")
	.setModifiers({ name: "Quicken", stacks: 1 }, { name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

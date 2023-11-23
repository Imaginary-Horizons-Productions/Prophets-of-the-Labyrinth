const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Evasive Sun Flare",
	"Inflict @{stagger} on a foe and gain @{mod0Stacks} @{mod0} with priority",
	"Also inflict @{mod1Stacks} @{mod1}",
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade, slow], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		let addedSlow = false;
		if (isCrit) {
			addedSlow = addModifier(target, slow);
		}
		target.addStagger(stagger);
		const addedEvade = addModifier(user, evade);
		return `${addedEvade ? `${user.getName(adventure.room.enemyIdMap)} prepares to Evade. ` : ""}${target.getName(adventure.room.enemyIdMap)} is Staggered${addedSlow ? ` and Slowed` : ""}.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Sun Flare", "Tormenting Sun Flare")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

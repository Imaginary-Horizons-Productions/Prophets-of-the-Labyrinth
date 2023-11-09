const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Evasive Sun Flare",
	"Inflict @{stagger} on a foe and gain @{mod0Stacks} @{mod0} with priority",
	"Also inflict @{mod1Stacks} @{mod1}",
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [evade, slow], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			addModifier(target, slow);
		}
		target.addStagger(stagger);
		addModifier(user, evade);
		return `${user.getName(adventure.room.enemyIdMap)} prepares to Evade. ${target.getName(adventure.room.enemyIdMap)} is Staggered${isCrit ? ` and Slowed` : ""}.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Sun Flare", "Tormenting Sun Flare")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

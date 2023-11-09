const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Sun Flare",
	"Inflict @{stagger} on a foe, then gain @{mod0Stacks} @{mod0} with priority",
	"Also inflict @{mod1Stacks} @{mod1}",
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [quicken, slow], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			addModifier(target, slow);
		}
		target.addStagger(stagger);
		addModifier(user, quicken);
		return `${user.getName(adventure.room.enemyIdMap)} is Quickened. ${target.getName(adventure.room.enemyIdMap)} is Staggered${isCrit ? ` and Slowed` : ""}.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Evasive Sun Flare", "Tormenting Sun Flare")
	.setModifiers({ name: "Quicken", stacks: 1 }, { name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

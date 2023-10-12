const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sun Flare",
	"Inflict @{mod1Stacks} @{mod1} on a foe with priority",
	"Also inflict @{mod2Stacks} @{mod2}",
	"Technique",
	"Light",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, stagger, slow] } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, slow);
		}
		addModifier(target, stagger);
		return `${target.getName(adventure.room.enemyIdMap)} is Staggered${isCrit ? " and Slowed" : ""}.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Accelerating Sun Flare", "Evasive Sun Flare", "Tormenting Sun Flare")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setDurability(15)
	.setPriority(1);

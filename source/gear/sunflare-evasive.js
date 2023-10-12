const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Evasive Sun Flare",
	"Inflict @{mod1Stacks} @{mod1} on a foe and gain @{mod2Stacks} @{mod2} with priority",
	"Also inflict @{mod3Stacks} @{mod3}",
	"Technique",
	"Light",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, stagger, evade, slow] } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, slow);
		}
		addModifier(target, stagger);
		addModifier(user, evade);
		return `${user.getName(adventure.room.enemyIdMap)} prepares to Evade. ${target.getName(adventure.room.enemyIdMap)} is Staggered${isCrit ? ` and Slowed` : ""}.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Accelerating Sun Flare", "Tormenting Sun Flare")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Slow", stacks: 2 }])
	.setDurability(15)
	.setPriority(1);

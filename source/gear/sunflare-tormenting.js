const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Tormenting Sun Flare",
	"Inflict @{mod1Stacks} @{mod1} on a foe and duplicate its debuffs with priority",
	"Also inflict @{mod2Stacks} @{mod2}",
	"Technique",
	"Light",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, stagger, slow] } = module.exports;
		for (const modifier in target.modifiers) {
			if (isDebuff(modifier)) {
				addModifier(target, { name: modifier, stacks: 1 });
			}
		}
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		addModifier(target, stagger);
		if (isCrit) {
			addModifier(target, slow);
			return `${target.getName(adventure.room.enemyIdMap)} is Staggered, their debuffs are duplicated, and they're slowed.`;
		} else {
			return `${target.getName(adventure.room.enemyIdMap)} is Staggered and their debuffs are duplicated.`;
		}
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Accelerating Sun Flare", "Evasive Sun Flare")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 })
	.setDurability(15)
	.setPriority(1);

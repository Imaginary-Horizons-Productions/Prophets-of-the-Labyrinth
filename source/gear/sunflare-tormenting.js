const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Tormenting Sun Flare",
	"Inflict @{stagger} on a foe and duplicate its debuffs with priority",
	"Also inflict @{mod0Stacks} @{mod0}",
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [slow], stagger } = module.exports;
		for (const modifier in target.modifiers) {
			if (isDebuff(modifier)) {
				addModifier(target, { name: modifier, stacks: 1 });
			}
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		target.addStagger(stagger);
		if (isCrit) {
			addModifier(target, slow);
			return `${target.getName(adventure.room.enemyIdMap)} is Staggered, their debuffs are duplicated, and they're slowed.`;
		} else {
			return `${target.getName(adventure.room.enemyIdMap)} is Staggered and their debuffs are duplicated.`;
		}
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Sun Flare", "Evasive Sun Flare")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

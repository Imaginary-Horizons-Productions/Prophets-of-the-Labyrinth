const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Tormenting Sun Flare",
	"Inflict @{foeStagger} on a foe and duplicate its debuffs with priority",
	"Also inflict @{mod0Stacks} @{mod0}",
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], stagger } = module.exports;
		const debuffs = [];
		for (const modifier in target.modifiers) {
			if (isDebuff(modifier)) {
				addModifier([target], { name: modifier, stacks: 1 });
				debuffs.push(modifier);
			}
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		changeStagger([target], stagger);
		const resultTexts = ["Staggered"];
		if (isCrit) {
			const addedSlow = addModifier([target], slow).length > 0;
			if (addedSlow) {
				resultTexts.push("Slowed");
			}
		}
		if (debuffs.length > 0) {
			resultTexts.push(`they gain ${listifyEN(debuffs, false)}`);
		}
		return `${target.getName(adventure.room.enemyIdMap)} is ${listifyEN(resultTexts, false)}.`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Sun Flare", "Evasive Sun Flare")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

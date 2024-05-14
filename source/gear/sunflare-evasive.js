const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Evasive Sun Flare",
	"Inflict @{foeStagger} on a foe and gain @{mod0Stacks} @{mod0} with priority",
	"Also inflict @{mod1Stacks} @{mod1}",
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade, slow], stagger } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		let addedSlow = false;
		if (isCrit) {
			addedSlow = addModifier([target], slow).length > 0;
		}
		changeStagger([target], stagger);
		const addedEvade = addModifier([user], evade).length > 0;
		const [userName, targetName] = getNames([user, target], adventure);
		return `${addedEvade ? `${userName} prepares to Evade. ` : ""}${targetName} is Staggered${addedSlow ? ` and Slowed` : ""}.`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Sun Flare", "Tormenting Sun Flare")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Slow", stacks: 2 })
	.setStagger(2)
	.setDurability(15)
	.setPriority(1);

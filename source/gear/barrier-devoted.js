const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Devoted Barrier",
	"Grant an ally @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}",
	"@{mod1} x@{critMultiplier}",
	"Spell",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedVigilance = addModifier(target, vigilance);
		addModifier(target, evade);
		return `${target.getName(adventure.room.enemyIdMap)}${addedVigilance ? " Vigilantly" : ""} prepares to Evade.`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Cleansing Barrier", "Long Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 1 })
	.setDurability(5);

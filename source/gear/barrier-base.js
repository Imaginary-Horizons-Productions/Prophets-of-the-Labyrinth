const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Barrier",
	"Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}",
	"@{mod1} x@{critMultiplier}",
	"Spell",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedVigilance = addModifier(user, pendingVigilance);
		addModifier(user, evade);
		return `${user.getName(adventure.room.enemyIdMap)}${addedVigilance ? " Vigilantly" : ""} prepares to Evade.`;
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setUpgrades("Cleansing Barrier", "Devoted Barrier", "Long Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 1 })
	.setDurability(5);

const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Soothing Inspiration",
	"Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to an ally",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp, regen], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingPowerUp.stacks += bonus;
		}
		const addedPowerUp = addModifier(target, pendingPowerUp);
		const addedRegen = addModifier(target, regen);
		if (addedPowerUp) {
			return `${target.getName(adventure.room.enemyIdMap)} is Powered Up and gains Regen.`;
		} else if (addedRegen) {
			return `${target.getName(adventure.room.enemyIdMap)} gains Regen.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Regen", stacks: 2 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);

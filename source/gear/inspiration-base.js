const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Inspiration",
	"Apply @{mod0Stacks} @{mod0} to an ally",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingPowerUp.stacks += bonus;
		}
		const addedPowerUp = addModifier(target, pendingPowerUp);
		if (addedPowerUp) {
			return `${target.getName(adventure.room.enemyIdMap)} is Powered Up.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Guarding Inspiration", "Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);

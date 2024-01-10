const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Guarding Inspiration",
	"Apply @{mod0Stacks} @{mod0} and @{protection} protection to an ally",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], bonus, protection } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingPowerUp.stacks += bonus;
		}
		const addedPowerUp = addModifier(target, pendingPowerUp);
		target.protection += protection;
		return `${target.getName(adventure.room.enemyIdMap)} is${addedPowerUp ? ` Powered Up and` : ""} gains protection.`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setProtection(25)
	.setDurability(10);

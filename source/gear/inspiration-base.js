const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Inspiration",
	"Apply @{mod0Stacks} @{mod0} to an ally",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerUp], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp, stacks: powerUp.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		addModifier(target, pendingPowerUp);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Up.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setUpgrades("Guarding Inspiration", "Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);

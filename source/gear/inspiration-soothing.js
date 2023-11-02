const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Soothing Inspiration",
	"Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to an ally",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerUp, regen], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp, stacks: powerUp.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		addModifier(target, pendingPowerUp);
		addModifier(target, regen);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Up and gains Regen.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Guarding Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Regen", stacks: 2 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);

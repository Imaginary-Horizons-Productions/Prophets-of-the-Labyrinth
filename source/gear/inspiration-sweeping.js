const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Sweeping Inspiration",
	"Apply @{mod0Stacks} @{mod0} to all allies",
	"@{mod0} +@{bonus}",
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], bonus } = module.exports;
		const pendingPowerUp = { ...powerUp };
		if (isCrit) {
			pendingPowerUp.stacks += bonus;
		}
		const poweredUpTargets = [];
		targets.forEach(target => {
			if (user.element === element) {
				target.addStagger("elementMatchAlly");
			}
			const addedPowerUp = addModifier(target, pendingPowerUp);
			if (addedPowerUp) {
				poweredUpTargets.push(target.getName(adventure.room.enemyIdMap));
			}
		})

		if (poweredUpTargets.length > 1) {
			return `${listifyEN(poweredUpTargets)} are Powered Up.`;
		} else if (poweredUpTargets.length === 1) {
			return `${poweredUpTargets[0]} is Powered Up.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Inspiration", "Soothing Inspiration")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setBonus(25) // Power Up stacks
	.setDurability(10);

const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Long Barrier",
	"Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}",
	"@{mod1} x@{critMultiplier}",
	"Spell",
	"Wind",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance, critVigilance] } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		let addedVigilance = true;
		if (isCrit) {
			addedVigilance = addModifier(user, vigilance);
		} else {
			addedVigilance = addModifier(user, critVigilance);
		}
		addModifier(user, evade);
		return `${user.getName(adventure.room.enemyIdMap)}${addedVigilance ? " Vigilantly" : ""} prepares to Evade.`;
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Cleansing Barrier", "Devoted Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 2 }, { name: "Vigilance", stacks: 4 })
	.setDurability(5);

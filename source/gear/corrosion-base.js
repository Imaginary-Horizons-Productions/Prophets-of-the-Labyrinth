const { GearTemplate } = require("../classes");
const { needsLivingTargets } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Corrosion",
	"Inflict @{mod1Stacks} @{mod1} on a foe",
	"Also inflict @{mod2Stacks} @{mod2}",
	"Spell",
	"Fire",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, powerDown, critStagger] } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, critStagger);
		}
		addModifier(target, powerDown);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Down.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Flanking Corrosion")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Power Down", stacks: 40 }, { name: "Stagger", stacks: 1 })
	.setDurability(15);

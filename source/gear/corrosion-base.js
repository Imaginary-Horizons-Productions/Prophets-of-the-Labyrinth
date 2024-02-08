const { GearTemplate } = require("../classes");
const { addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Corrosion",
	"Inflict @{mod0Stacks} @{mod0} on a foe",
	"Also inflict @{extraStagger}",
	"Spell",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerDown], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		const addedPowerDown = addModifier(target, powerDown);
		if (addedPowerDown) {
			return `${target.getName(adventure.room.enemyIdMap)} is Powered Down${isCrit ? " and Staggered" : ""}.`;
		} else if (isCrit) {
			return `${target.getName(adventure.room.enemyIdMap)} is Staggered.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Flanking Corrosion", "Harmful Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 })
	.setStagger(2)
	.setDurability(15);

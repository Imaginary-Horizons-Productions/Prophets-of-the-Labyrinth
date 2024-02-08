const { GearTemplate } = require("../classes");
const { addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Flanking Corrosion",
	"Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a foe",
	"Also inflict @{extraStagger}",
	"Spell",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerDown, exposed], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		const addedPowerDown = addModifier(target, powerDown);
		const addedExposed = addModifier(target, exposed);
		if (addedPowerDown) {
			if (isCrit) {
				return `${target.getName(adventure.room.enemyIdMap)} is Powered Down, Exposed, and Staggered.`;
			} else {
				return `${target.getName(adventure.room.enemyIdMap)} is Powered Down and Exposed.`;
			}
		} else if (addedExposed) {
			if (isCrit) {
				return `${target.getName(adventure.room.enemyIdMap)} is Exposed and Staggered.`;
			} else {
				return `${target.getName(adventure.room.enemyIdMap)} is Exposed.`;
			}
		} else if (isCrit) {
			return `${target.getName(adventure.room.enemyIdMap)} is Staggered.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Harmful Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 }, { name: "Exposed", stacks: 2 })
	.setStagger(2)
	.setDurability(15);

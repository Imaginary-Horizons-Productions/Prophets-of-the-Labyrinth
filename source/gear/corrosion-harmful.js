const { GearTemplate } = require("../classes");
const { addModifier, dealDamage } = require("../util/combatantUtil");

module.exports = new GearTemplate("Harmful Corrosion",
	"Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on a foe",
	"Also inflict @{extraStagger}",
	"Spell",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerDown], stagger, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		const addedPowerDown = addModifier(target, powerDown);
		if (addedPowerDown) {
			return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Powered Down${isCrit ? " and Staggered" : ""}.`;
		} else {
			return `${dealDamage([target], user, pendingDamage, false, element, adventure)}${isCrit ? ` ${target.getName(adventure.room.enemyIdMap)} is Staggered.` : ""}`;
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 })
	.setStagger(2)
	.setDamage(50)
	.setDurability(15);

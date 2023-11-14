const { GearTemplate } = require("../classes");
const { addModifier, dealDamage } = require("../util/combatantUtil");

module.exports = new GearTemplate("Harmful Corrosion",
	"Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on a foe",
	"Also inflict @{stagger}",
	"Spell",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerDown], stagger, damage } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		addModifier(target, powerDown);
		return `${dealDamage([target], user, damage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Powered Down.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 40 })
	.setStagger(2)
	.setDamage(50)
	.setDurability(15);

const { GearTemplate } = require("../classes");
const { addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Corrosion",
	"Inflict @{mod0Stacks} @{mod0} on a foe",
	"Also inflict @{stagger}",
	"Spell",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerDown], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		addModifier(target, powerDown);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Down.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Flanking Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 40 })
	.setStagger(2)
	.setDurability(15);

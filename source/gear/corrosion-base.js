const { GearTemplate } = require("../classes");
const { needsLivingTargets } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Corrosion",
	"Inflict @{mod0Stacks} @{mod0} on a foe",
	"Also inflict @{stagger}",
	"Spell",
	"Fire",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerDown], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		addModifier(target, powerDown);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Down.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Flanking Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 40 })
	.setStagger(2)
	.setDurability(15);

const { GearTemplate } = require("../classes");
const { needsLivingTargets } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Shattering Corrosion",
	"Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a foe",
	"Also inflict @{stagger}",
	"Spell",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerDown, frail], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		addModifier(target, powerDown);
		addModifier(target, frail);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Down.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Flanking Corrosion")
	.setModifiers({ name: "Power Down", stacks: 40 }, { name: "Frail", stacks: 4 })
	.setStagger(2)
	.setDurability(15);

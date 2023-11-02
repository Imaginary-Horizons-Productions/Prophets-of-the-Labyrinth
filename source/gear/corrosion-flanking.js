const { GearTemplate } = require("../classes");
const { needsLivingTargets } = require("../shared/actionComponents");
const { addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Flanking Corrosion",
	"Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a foe",
	"Also inflict @{stagger}",
	"Spell",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerDown, exposed], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		addModifier(target, powerDown);
		addModifier(target, exposed);
		return `${target.getName(adventure.room.enemyIdMap)} is Powered Down and Exposed.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers({ name: "Power Down", stacks: 40 }, { name: "Exposed", stacks: 2 })
	.setStagger(2)
	.setDurability(15);

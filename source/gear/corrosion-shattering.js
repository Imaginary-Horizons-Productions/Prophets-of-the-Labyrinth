const { GearTemplate } = require("../classes");
const { addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Shattering Corrosion",
	"Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a foe",
	"Also inflict @{foeStagger}",
	"Spell",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerDown, frail], stagger } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			target.addStagger(stagger);
		}
		const addedPowerDown = addModifier(target, powerDown);
		const addedFrail = addModifier(target, frail);
		if (addedPowerDown) {
			if (isCrit) {
				return `${target.getName(adventure.room.enemyIdMap)} is Powered Down, becomes Frail, and is Staggered.`;
			} else {
				return `${target.getName(adventure.room.enemyIdMap)} is Powered Down and becomes Frail.`;
			}
		} else if (addedFrail) {
			if (isCrit) {
				return `${target.getName(adventure.room.enemyIdMap)} becomes Frail and is Staggered.`;
			} else {
				return `${target.getName(adventure.room.enemyIdMap)} becomes Frail.`;
			}
		} else if (isCrit) {
			return `${target.getName(adventure.room.enemyIdMap)} is Staggered.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Corrosion", "Harmful Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 }, { name: "Frail", stacks: 4 })
	.setStagger(2)
	.setDurability(15);

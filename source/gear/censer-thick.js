const { GearTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { dealDamage, addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Thick Censer",
	"Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage",
	"Also apply @{mod0Stacks} @{mod0}",
	"Trinket",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, bonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			damage += bonus;
		}
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			const addedSlow = addModifier(target, slow);
			return `${damageText}${addedSlow ? ` ${target.getName(adventure.room.enemyIdMap)} is Slowed.` : ""}`;
		} else {
			return damageText;
		}
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Fate-Sealing Censer", "Tormenting Censor")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(50)
	.setBonus(75) // damage
	.setDurability(30);

const { GearTemplate } = require("../classes");
const { needsLivingTargets } = require("../shared/actionComponents");
const { dealDamage, addModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Tormenting Censer",
	"Burn a foe for @{damage} (+@{bonus} if target has debuffs) @{element} damage, duplicate its debuffs",
	"Also apply @{mod1Stacks} @{mod1}",
	"Trinket",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, slow], damage, bonus } = module.exports;
		for (const modifier in target.modifiers) {
			if (isDebuff(modifier)) {
				addModifier(target, { name: modifier, stacks: 1 });
			}
		}
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			damage += bonus;
		}
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			addModifier(target, slow);
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Slowed and their other debuffs are duplicated.`;
		} else {
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)}'s debuffs are duplicated.`;
		}
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Fate-Sealing Censer", "Thick Censer")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 })
	.setDamage(50)
	.setBonus(75) // damage
	.setDurability(15);

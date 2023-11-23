const { GearTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { dealDamage, addModifier } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Tormenting Censer",
	"Burn a foe for @{damage} (+@{bonus} if target has debuffs) @{element} damage, duplicate its debuffs",
	"Also apply @{mod0Stacks} @{mod0}",
	"Trinket",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, bonus } = module.exports;
		const debuffs = [];
		for (const modifier in target.modifiers) {
			if (isDebuff(modifier)) {
				addModifier(target, { name: modifier, stacks: 1 });
				debuffs.push(modifier);
			}
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			damage += bonus;
		}
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			const addedSlow = addModifier(target, slow);
			if (addedSlow) {
				return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Slowed${debuffs.length > 0 ? ` and they gain ${listifyEN(debuffs)}` : ""}.`;
			}
		}
		return `${damageText}${debuffs.length > 0 ? `${target.getName(adventure.room.enemyIdMap)}'s gains ${listifyEN(debuffs)}.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Fate-Sealing Censer", "Thick Censer")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(50)
	.setBonus(75) // damage
	.setDurability(15);

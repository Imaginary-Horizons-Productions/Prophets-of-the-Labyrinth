const { GearTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { dealDamage, addModifier, changeStagger, getNames } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Tormenting Censer",
	"Burn a foe for @{damage} (+@{bonus} if target has debuffs) @{element} damage, duplicate its debuffs",
	"Also apply @{mod0Stacks} @{mod0}",
	"Trinket",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const debuffs = [];
		for (const modifier in target.modifiers) {
			if (isDebuff(modifier)) {
				addModifier([target], { name: modifier, stacks: 1 });
				debuffs.push(modifier);
			}
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			pendingDamage += bonus;
		}
		const damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			const addedSlow = addModifier([target], slow).length > 0;
			if (addedSlow) {
				return `${damageText} ${getNames([target], adventure)[0]} is Slowed${debuffs.length > 0 ? ` and they gain ${listifyEN(debuffs, false)}` : ""}.`;
			}
		}
		return `${damageText}${debuffs.length > 0 ? `${getNames([target], adventure)[0]}'s gains ${listifyEN(debuffs, false)}.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Staggering Censer", "Thick Censer")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setDurability(15);

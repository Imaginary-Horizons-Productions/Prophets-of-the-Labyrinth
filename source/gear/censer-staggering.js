const { GearTemplate } = require('../classes/index.js');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Staggering Censer",
	[
		["use", "Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage"],
		["Critical💥", "Also apply @{mod0Stacks} @{mod0}"]
	],
	"Trinket",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], stagger, damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			pendingDamage += bonus;
		}
		changeStagger([target], stagger);
		const damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			const addedSlow = addModifier([target], slow).length > 0;
			return `${damageText}${addedSlow ? ` ${getNames([target], adventure)[0]} is Slowed.` : ""}`;
		} else {
			return damageText;
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Thick Censer", "Tormenting Censor")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setStagger(2)
	.setDurability(15);

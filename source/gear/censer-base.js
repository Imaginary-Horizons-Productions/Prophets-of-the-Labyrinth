const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { dealDamage, addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Censer",
	[
		["use", "Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage"],
		["Critical💥", "Also apply @{mod0Stacks} @{mod0}"]
	],
	"Trinket",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			pendingDamage += bonus;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			const addedSlow = addModifier([target], slow).length > 0;
			if (addedSlow) {
				resultLines.push(` ${target.name} gains ${getApplicationEmojiMarkdown("Slow")}.`);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Staggering Censer", "Thick Censer", "Tormenting Censor")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setDurability(15);

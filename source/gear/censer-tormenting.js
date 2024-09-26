const { GearTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { dealDamage, addModifier, changeStagger } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");

module.exports = new GearTemplate("Tormenting Censer",
	[
		["use", "Burn a foe for @{damage} (+@{bonus} if target has debuffs) @{element} damage, duplicate its debuffs"],
		["Critical💥", "Also apply @{mod0Stacks} @{mod0}"]
	],
	"Trinket",
	"Fire",
	350,
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
		if (target.hp > 0) {
			const debuffs = [];
			if (isCrit) {
				const addedSlow = target.getModifierStacks("Oblivious") < 1;
				addModifier([target], slow);
				if (addedSlow) {
					debuffs.push(getApplicationEmojiMarkdown("Slow"));
				}
			}
			for (const modifier in target.modifiers) {
				if (isDebuff(modifier)) {
					addModifier([target], { name: modifier, stacks: 1 });
					debuffs.push(getApplicationEmojiMarkdown(modifier));
				}
			}
			resultLines.push(`${target.name} gains ${debuffs.join("")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Staggering Censer", "Thick Censer")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setDurability(15);

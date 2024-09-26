const { GearTemplate } = require('../classes/index.js');
const { addModifier, getCombatantWeaknesses, changeStagger } = require('../util/combatantUtil.js');
const { elementsList, getResistances } = require('../util/elementUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Urgent Sabotage Kit",
	[
		["use", "Afflict a foe with @{mod0Stacks} @{mod0} and @{mod1Stacks} stacks of a random weakness with priority"],
		["Critical💥", "Slow and Weakness +@{bonus}"]
	],
	"Weapon",
	"Untyped",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow, weakness], bonus } = module.exports;
		const pendingSlow = { ...slow };
		const pendingWeakness = { stacks: weakness.stacks };
		const ineligibleWeaknesses = getResistances(target.element).concat(getCombatantWeaknesses(target));
		const weaknessPool = elementsList(ineligibleWeaknesses);
		pendingWeakness.name = `${weaknessPool[adventure.generateRandomNumber(weaknessPool.length, "battle")]} Weakness`;
		if (isCrit) {
			pendingSlow.stacks += bonus;
			pendingWeakness.stacks += bonus;
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		const debuffs = [];
		const addedSlow = target.getModifierStacks("Oblivious") < 1;
		addModifier([target], pendingSlow);
		if (addedSlow) {
			debuffs.push(getApplicationEmojiMarkdown("Slow"));
		}
		if (weaknessPool.length > 0) {
			const addedWeakness = target.getModifierStacks("Oblivious") < 1;
			addModifier([target], pendingWeakness);
			if (addedWeakness) {
				debuffs.push(getApplicationEmojiMarkdown(pendingWeakness.name));
			}
		}
		if (debuffs.length > 0) {
			return [`${target.name} gains ${debuffs.join("")}.`];
		} else {
			return [];
		}
	}
).setSidegrades("Potent Sabotage Kit", "Shattering Sabotage Kit")
	.setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Slow", stacks: 2 }, { name: "unparsed random weakness", stacks: 3 })
	.setBonus(2) // Crit Slow and Weakness stacks
	.setDurability(15)
	.setPriority(1)
	.setFlavorText({ name: "Eligible Weaknesses", value: "The rolled weakness won't be one of the target's resistances or existing weaknesses" });

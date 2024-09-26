const { GearTemplate } = require('../classes');
const { dealDamage, removeModifier, changeStagger } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Fever Break",
	[
		["use", `Deal @{element} damage to a foe, equal to pending damage from @{mod0} and @{mod1}, then remove those debuffs`],
		["Critical💥", "@{mod0} and @{mod1} are not removed"]
	],
	"Spell",
	"Darkness",
	200,
	(targets, user, isCrit, adventure) => {
		const { element } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const funnelCount = adventure.getArtifactCount("Spiral Funnel");
		const resultLines = [];
		for (const target of targets) {
			const poisons = target.getModifierStacks("Poison");
			const frails = target.getModifierStacks("Frail");
			const pendingDamage = (10 + 5 * funnelCount) * (poisons ** 2 + poisons) / 2 + (20 + 5 * funnelCount) * frails;
			resultLines.push(...dealDamage([target], user, pendingDamage, false, element, adventure));
			if (!isCrit) {
				const removedDebuffs = [];
				const curedPoison = targets[0].getModifierStacks("Retain") < 1;
				removeModifier(targets, { name: "Poison", stacks: "all" });
				if (curedPoison) {
					removedDebuffs.push(getApplicationEmojiMarkdown("Poison"));
				}
				const curedFrail = targets[0].getModifierStacks("Retain") < 1;
				removeModifier(targets, { name: "Frail", stacks: "all" });
				if (curedFrail) {
					removedDebuffs.push(getApplicationEmojiMarkdown("Frail"));
				}
				resultLines.push(`${target.name} is cured of ${removedDebuffs.join("")}.`);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Organic Fever Break", "Surpassing Fever Break", "Urgent Fever Break")
	.setModifiers({ name: "Poison", stacks: 0 }, { name: "Frail", stacks: 0 })
	.setDurability(5);

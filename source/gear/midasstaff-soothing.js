const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Soothing Midas Staff",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to a combatant"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Trinket",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [curse, regen], bonus } = module.exports;
		const pendingCurse = { ...curse };
		if (isCrit) {
			pendingCurse.stacks += bonus;
		}
		if (user.element === element) {
			if (target.team === user.team) {
				changeStagger([target], "elementMatchAlly");
			} else {
				changeStagger([target], "elementMatchFoe");
			}
		}
		const addedCurse = target.getModifierStacks("Oblivious") < 1;
		addModifier([target], pendingCurse);
		const addedModifiers = [];
		if (addedCurse) {
			addedModifiers.push(getApplicationEmojiMarkdown("Curse of Midas"));
		}
		const addedRegen = target.getModifierStacks("Oblivious") < 1;
		addModifier([target], regen);
		if (addedRegen) {
			addedModifiers.push(getApplicationEmojiMarkdown("Regen"));
		}
		if (addedModifiers.length > 0) {
			return [`${target.name} gains ${addedModifiers.join("")}.`];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setSidegrades("Accelerating Midas Staff", "Discounted Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 2 }, { name: "Regen", stacks: 2 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);

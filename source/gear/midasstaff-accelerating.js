const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Accelerating Midas Staff",
	[
		["use", "Apply @{mod0Stacks} @{mod0} to a combatant, then gain @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Trinket",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [curse, quicken], bonus } = module.exports;
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
		const [targetName, userName] = getNames([target, user], adventure);
		const addedCurse = addModifier([target], pendingCurse).length > 0;
		const addedQuicken = addModifier([user], quicken).length > 0;
		const resultLines = [];
		if (targetName === userName) {
			const userEffects = [];
			if (addedCurse) {
				userEffects.push(getApplicationEmojiMarkdown("Curse of Midas"));
			}
			if (addedQuicken) {
				userEffects.push(getApplicationEmojiMarkdown("Quicken"));
			}
			resultLines.push(`${userName} gains ${userEffects.join("")}.`);
		} else {
			if (addedCurse) {
				resultLines.push(`${targetName} gains ${getApplicationEmojiMarkdown("Curse of Midas")}.`);
			}
			if (addedQuicken) {
				resultLines.push(`${userName} gains ${getApplicationEmojiMarkdown("Quickened")}.`);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setSidegrades("Discounted Midas Staff", "Soothing Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 2 }, { name: "Quicken", stacks: 1 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);

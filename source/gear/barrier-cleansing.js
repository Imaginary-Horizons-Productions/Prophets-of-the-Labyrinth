const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Cleansing Barrier",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} and cure a random debuff"],
		["Critical💥", "@{mod1} x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedModifiers = [];
		const addedVigilance = addModifier([user], pendingVigilance).length > 0;
		if (addedVigilance) {
			addedModifiers.push(getApplicationEmojiMarkdown("Vigilance"));
		}
		const addedEvade = addModifier([user], evade).length > 0;
		if (addedEvade) {
			addedModifiers.push(getApplicationEmojiMarkdown("Evade"));
		}
		const resultLines = [];
		if (addedModifiers.length > 0) {
			resultLines.push(`${user.name} gains ${addedModifiers.join("")}.`);
		}
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		if (userDebuffs.length > 0) {
			const rolledDebuff = userDebuffs[adventure.generateRandomNumber(userDebuffs.length, "battle")];
			const debuffWasRemoved = removeModifier([user], { name: rolledDebuff, stacks: "all" }).length > 0;
			if (debuffWasRemoved) {
				resultLines.push(`${user.name} shrugs off ${rolledDebuff}.`);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false })
	.setSidegrades("Devoted Barrier", "Vigilant Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 1 })
	.setDurability(5);

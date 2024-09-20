const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { accuratePassive } = require('./descriptions/passives.js');

module.exports = new GearTemplate("Accelerating Cloak",
	[
		accuratePassive,
		["use", "Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} +@{bonus} and @{mod1} +@{bonus}"]
	],
	"Armor",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade, quicken], bonus } = module.exports;
		const pendingEvade = { ...evade };
		const pendingQuicken = { ...quicken };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingEvade.stacks += bonus;
			pendingQuicken.stacks += bonus;
		}
		const results = [];
		const addedEvade = addModifier([user], pendingEvade).length > 0;
		if (addedEvade) {
			results.push(getApplicationEmojiMarkdown("Evade"));
		}
		const addedQuicken = addModifier([user], pendingQuicken).length > 0;
		if (addedQuicken) {
			results.push(getApplicationEmojiMarkdown("Quicken"));
		}
		if (results.length > 0) {
			return [`${getNames([user], adventure)[0]} gains ${results.join("")}.`];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false })
	.setSidegrades("Accurate Cloak", "Evasive Cloak")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Quicken", stacks: 1 })
	.setBonus(1) // Evade stacks
	.setCritRate(5)
	.setDurability(15);

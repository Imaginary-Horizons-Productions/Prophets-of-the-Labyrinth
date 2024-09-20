const { GearTemplate } = require('../classes/index.js');
const { addModifier, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Greed",
	[["use", "Add @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to all Treasure Elementals with priority"]],
	"Action",
	"Untyped",
	0,
	(targets, user, isCrit, adventure) => {
		const { modifiers: [midas, powerUp] } = module.exports;
		const poweredUpTargets = addModifier(targets.filter(target => target.archetype === "Treasure Elemental"), powerUp);
		const affectedTargets = addModifier(poweredUpTargets, midas);
		if (affectedTargets.length > 0) {
			return [joinAsStatement(false, getNames(affectedTargets, adventure), "gains", "gain", `${getApplicationEmojiMarkdown("Curse of Midas")}${getApplicationEmojiMarkdown("Power Up")}.`)];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Curse of Midas", stacks: 1 }, { name: "Power Up", stacks: 20 });

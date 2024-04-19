const { GearTemplate } = require('../classes/index.js');
const { addModifier, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Greed",
	"Add @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to all Treasure Elementals with priority",
	"N/A",
	"Action",
	"Untyped",
	0,
	(targets, user, isCrit, adventure) => {
		const { modifiers: [midas, powerUp] } = module.exports;
		const poweredUpTargets = addModifier(targets.filter(target => target.archetype === "Treasure Elemental"), powerUp);
		const affectedTargets = addModifier(poweredUpTargets, midas);
		if (affectedTargets.length > 0) {
			return joinAsStatement(false, getNames(affectedTargets, adventure), "gains", "gain", "Curse of Midas and Power Up.");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Curse of Midas", stacks: 1 }, { name: "Power Up", stacks: 20 });

const { GearTemplate } = require('../classes/index.js');
const { removeModifier } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Appease",
	[["use", "Shrug off all insults"]],
	"Action",
	"Untyped",
	0,
	(targets, user, isCrit, adventure) => {
		const curedInsults = [];
		for (const insult of ["Boring", "Lacking Rhythm", "Smelly", "Stupid", "Ugly"]) {
			if (insult in user.modifiers) {
				curedInsults.push(getApplicationEmojiMarkdown(insult));
			}
			removeModifier([user], { name: insult, stacks: "all", force: true });
		}
		if (curedInsults.length > 0) {
			return [`${user.name} shrugs off ${curedInsults.join("")}.`];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false });

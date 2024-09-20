const { GearTemplate } = require('../classes/index.js');
const { removeModifier, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Appease",
	[["use", "Shrug off all insults"]],
	"Action",
	"Untyped",
	0,
	(targets, user, isCrit, adventure) => {
		const curedInsults = [];
		for (const insult of ["Boring", "Lacking Rhythm", "Smelly", "Stupid", "Ugly"]) {
			const insultRemoved = removeModifier([user], { name: insult, stacks: "all", force: true }).length > 0;
			if (insultRemoved) {
				curedInsults.push(getApplicationEmojiMarkdown(insult));
			}
		}
		if (curedInsults.length > 0) {
			return [`${getNames([user], adventure)[0]} shrugs off ${curedInsults.join("")}.`];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false });

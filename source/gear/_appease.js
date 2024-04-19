const { GearTemplate } = require('../classes/index.js');
const { removeModifier, getNames } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Appease",
	"Shrug off all insults",
	"N/A",
	"Action",
	"Untyped",
	0,
	(targets, user, isCrit, adventure) => {
		const curedInsults = [];
		for (const insult of ["Boring", "Lacking Rhythm", "Smelly", "Stupid", "Ugly"]) {
			const insultRemoved = removeModifier([user], { name: insult, stacks: "all", force: true }).length > 0;
			if (insultRemoved) {
				curedInsults.push(insult);
			}
		}
		if (curedInsults.length > 0) {
			return `${getNames([user], adventure)[0]} shrugs off ${listifyEN(curedInsults, false)}.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false });

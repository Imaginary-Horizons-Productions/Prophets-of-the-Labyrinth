const { GearTemplate } = require('../classes/index.js');
const { removeModifier } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Appease",
	"Shrug off all insults",
	"N/A",
	"Technique",
	"Untyped",
	0,
	(targets, user, isCrit, adventure) => {
		const curedInsults = [];
		for (const insult of ["Boring", "Lacking Rhythm", "Smelly", "Stupid", "Ugly"]) {
			const insultRemoved = removeModifier(user, { name: insult, stacks: "all", force: true });
			if (insultRemoved) {
				curedInsults.push(insult);
			}
		}
		if (curedInsults.length > 0) {
			return `${user.getName(adventure.room.enemyIdMap)} shrugs off ${listifyEN(curedInsults, false)}.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false });

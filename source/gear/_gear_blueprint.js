const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("name",
	[
		["Passive", "text"],
		["use", "move description"],
		["Critical💥", "crit description"]
	],
	"category",
	"essence",
	200,
	(targets, user, adventure) => {
		const { essence } = module.exports;
		if (user.essence === essence) {

		}
		if (user.crit) {

		}
		return []; // see style guide for conventions on result texts
	}
).setTargetingTags({ type: "", team: "" })
	.setCooldown();

const { GearTemplate } = require('../classes');
//TODONOW finish
module.exports = new GearTemplate("name",
	[
		["Requirement", "text"],
		["Passive", "text"],
		["use", "move description"],
		["Critical💥", "crit description"]
	],
	"category",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { element } = module.exports;
		if (user.element === element) {

		}
		if (user.crit) {

		}
		return []; // see style guide for conventions on result texts
	}
).setTargetingTags({ type: "", team: "" })
	.setDurability();

const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("name",
	[
		["Passive", "text"],
		["use", "move description"],
		["critical", "crit description"]
	],
	"category",
	"essence",
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence } = module.exports;
		if (user.essence === essence) {

		}
		if (user.crit) {

		}
		return []; // see style guide for conventions on result texts
	}, { type: "", team: "" })
	.setCooldown();

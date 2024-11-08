const { GearTemplate } = require('../classes');
const { changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Carrot",
	[
		["Requirement", "text"],
		["Passive", "text"],
		["use", "Entice an ally's pet to use a move this turn"],
		["Critical💥", "crit description"]
	],
	"Technique",
	"Earth",
	200,
	(targets, user, adventure) => {
		//TODONOW should filter out Loaf Around
		const { element } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (user.crit) {

		}
		return []; // see style guide for conventions on result texts
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setDurability(15);

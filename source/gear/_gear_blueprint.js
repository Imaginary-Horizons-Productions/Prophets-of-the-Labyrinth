const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("name",
	"description",
	"crit description",
	"category",
	"element",
	200,
	(targets, user, isCrit, adventure) => {
		const { element } = module.exports;
		if (user.element === element) {

		}
		if (isCrit) {

		}
		return ""; // see style guide for conventions on result texts
	}
).setTargetingTags({ target: "", team: "", needsLivingTargets: true })
	.setDurability();

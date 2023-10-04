const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("name",
	"description",
	"crit description",
	"category",
	"element",
	200,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger] } = module.exports;
		if (user.element === element) {

		}
		if (isCrit) {

		}
		return ""; // see style guide for conventions on result texts
	}
).setTargetingTags({ target: "", team: "" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability();

const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("name", "description", "element", effect, [])
	.setCategory("")
	.setTargetingTags({ target: "", team: "" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost()
	.setUses();

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger] } = module.exports;
	if (user.element === element) {

	}
	if (isCrit) {

	}
	return ""; // see style guide for conventions on result texts
}

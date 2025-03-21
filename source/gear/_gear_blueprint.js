const { GearTemplate, GearFamily } = require('../classes');

//#region Base
const base = new GearTemplate("name",
	[
		["Passive", "text"],
		["use", "move description"],
		["critical", "crit description"]
	],
	"category",
	"essence",
).setCost(200)
	.setEffect(execute, { type: "", team: "" })
	.setCooldown();

/** @type {typeof base.effect} */
function execute(targets, user, adventure) {
	if (user.essence === base.essence) {

	}
	if (user.crit) {

	}
	return []; // see style guide for conventions on result texts
}
//#endregion Base

module.exports = new GearFamily(base, [], false);

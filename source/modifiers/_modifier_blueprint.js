const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("name",
	"description",
	true,
	false,
	1
).setInverse("name");

const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("name",
	"description",
	"emoji markdown",
	true,
	false,
	1
).setInverse("name");

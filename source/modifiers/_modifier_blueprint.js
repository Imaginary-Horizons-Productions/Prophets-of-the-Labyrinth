const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("name",
	"description",
	null,
	true,
	false,
	1
).setInverse("name");

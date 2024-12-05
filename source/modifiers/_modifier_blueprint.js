const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("name",
	"description",
	"category",
	0,
	1
).setInverse("name");

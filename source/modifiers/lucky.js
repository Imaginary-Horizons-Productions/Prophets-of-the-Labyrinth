const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Lucky",
	"For the next @{stackCount} round(s), your moves roll for Critical Hit @{stackCount+1} times and are Critical Hits if any roll succeeds.",
	true,
	false,
	1
).setInverse("Unlucky");

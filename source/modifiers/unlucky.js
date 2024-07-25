const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Unlucky",
	"For the next @{stackCount} round(s), your moves roll for Critical Hit @{stackCount+1} times and are Critical Hits only if half or more rolls succeed.",
	"<:Unlucky:1266117872984260610>",
	false,
	true,
	1
).setInverse("Lucky");

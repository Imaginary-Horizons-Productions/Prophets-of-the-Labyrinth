const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Unlucky",
	"For your next @{stackCount} move(s) roll for Critical Hit @{stackCount+1} times, they are Critical Hits only if half or more rolls succeed.",
	"<:Unlucky:1266117872984260610>",
	false,
	true,
	0
).setInverse("Lucky");

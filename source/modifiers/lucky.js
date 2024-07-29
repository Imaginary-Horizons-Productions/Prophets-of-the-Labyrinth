const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Lucky",
	"For your next @{stackCount} move(s) roll for Critical Hit @{stackCount+1} times, they are Critical Hits if any roll succeeds.",
	"<:Lucky:1266117709297619045>",
	true,
	false,
	0
).setInverse("Unlucky");

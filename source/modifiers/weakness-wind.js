const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Wind Weakness",
	"Suffer weakness to Wind damage for @{stackCount} rounds.",
	"<:WindWeakness:1271513945433313301>",
	false,
	true,
	1
).setInverse("Wind Absorb");

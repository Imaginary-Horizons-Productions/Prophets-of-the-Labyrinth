const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Best-in-Class Hammer",
	"Gain @{copies} extra room actions in Workshops.",
	"Increase the room actions gained by 1 per hammer",
	"Fire"
).setFlavorText({ name: "*Additional Notes*", value: "*Pulls like this are worth every Primo Gem! What do you mean the currency isn't actually named 'Primo Gem'?*" });

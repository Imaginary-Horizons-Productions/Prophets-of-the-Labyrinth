const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Best-in-Class Hammer",
	"Gain @{copies} extra room actions in Workshops.",
	"Increase the room actions gained by 1 per hammer",
	"Untyped"
).setFlavorText({ name: "*Additional Notes*", value: "*All those extra pulls were definitely worth it, right?*" });

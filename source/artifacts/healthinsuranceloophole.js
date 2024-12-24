const { ArtifactTemplate } = require("../classes")

module.exports = new ArtifactTemplate("Health Insurance Loophole",
	"When being healed, convert each point of excess HP to @{copies} gold.",
	"Increase gold conversion by 1 for each loophole",
	"Unaligned"
).setFlavorText({ name: "*Additional Notes*", value: "*What's next, a sword that converts excess healing into protection?*" });

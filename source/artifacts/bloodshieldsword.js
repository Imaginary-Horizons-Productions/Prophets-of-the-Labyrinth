const { ArtifactTemplate } = require("../classes")

module.exports = new ArtifactTemplate("Bloodshield Sword",
	"When being healed, convert each point of excess hp to @{copies} block.",
	"Increase block conversion by 1 for each sword",
	"Untyped"
).setFlavorText({ name: "*Additional Notes*", value: "*What's next, a sword that heals those it slashes?*" })

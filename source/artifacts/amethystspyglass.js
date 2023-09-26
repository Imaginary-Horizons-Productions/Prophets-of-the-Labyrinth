const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Amethyst Spyglass",
	"Get a discount on scouting of @{copies*15} gold.",
	"Increase discount by 15g per spyglass",
	"Untyped"
).setFlavorText({ name: "*Additional Notes*", value: "*Peering through it makes things look blocky*" })

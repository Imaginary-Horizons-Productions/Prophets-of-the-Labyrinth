const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Spiral Funnel",
	"Increase modifier damage (eg Poison and Frail) dealt to enemies by @{copies*2} per stack.",
	"Increase damage per stack by 2 per funnel",
	"Untyped"
).setFlavorText({ name: "*Artifact Usage Survey Report*", value: "*Found to be a major contributor to toxic spiralling in dungeon delves*" })

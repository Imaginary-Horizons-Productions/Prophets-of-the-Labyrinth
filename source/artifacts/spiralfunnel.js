const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Spiral Funnel",
	"Increase damage dealt to enemies by modifiers (eg Poison and Frailty) by @{copies*2} per stack.",
	"Increase damage per stack by 2 per funnel",
	"Unaligned",
	300
).setFlavorText({ name: "*Artifact Usage Survey Report*", value: "*Found to be a major contributor to toxic spiralling in dungeon delves*" })

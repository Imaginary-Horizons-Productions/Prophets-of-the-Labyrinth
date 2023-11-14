const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("name",
	"description",
	"scaling description",
	"element"
).setFlavorText({ name: "heading", value: "text" });

const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("name",
	"description",
	"scaling description",
	"essence"
).setFlavorText({ name: "heading", value: "text" });

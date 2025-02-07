const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("name",
	"description",
	"scaling description",
	"essence",
	300
).setFlavorText({ name: "heading", value: "text" });

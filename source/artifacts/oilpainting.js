const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Oil Painting",
	"Gain 500g when obtaining this artifact.",
	"Gain 500g each time",
	"Untyped"
).setFlavorText({ name: "Additional Notes", value: "This will likely end up in the museum of a powerful nation." });

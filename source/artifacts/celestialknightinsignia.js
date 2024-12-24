const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Celestial Knight Insignia",
	"If a delver crits, they're healed for @{copies*15} HP.",
	"Increase healing by 15 for each insignia",
	"Unaligned"
);

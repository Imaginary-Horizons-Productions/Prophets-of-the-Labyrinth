const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Add Blocker",
	"When an enemy with @e{Cowardice} is downed, all delvers gain @{copies*150} protection.",
	"Increase the protection provided by 150 per stop sign",
	"Unaligned",
	300
);

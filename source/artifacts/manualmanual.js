const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Manual Manual",
	"Increase stats gained from leveling-up by @{copies*10}%.",
	"Increase the stat boost by 10% per manual",
	"Unaligned"
).setFlavorText({ name: "*Additional Notes*", value: "*Though written in a lost language, its title appears to be 'Reading for Dummies'.*" });

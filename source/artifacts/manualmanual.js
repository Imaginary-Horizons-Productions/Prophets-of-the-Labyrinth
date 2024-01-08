const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Manual Manual",
	"Increase the number of levels gained from combat by @{copies}.",
	"Increase the level boost by 1 per manual",
	"Untyped"
).setFlavorText({ name: "*Additional Notes*", value: "*Though written in a lost language, its title appears to be 'Reading for Dummies'.*" });

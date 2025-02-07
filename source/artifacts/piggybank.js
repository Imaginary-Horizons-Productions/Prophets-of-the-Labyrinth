const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Piggy Bank",
	"Gain @{copies*5}% of your current gold when you enter a new room.",
	"Increase rate of interest (additively) by 5% per piggy bank",
	"Water",
	300
).setFlavorText({ name: "*Additional Notes*", value: "*This little oinker will yield useful items in the gacha machine of life.*" });

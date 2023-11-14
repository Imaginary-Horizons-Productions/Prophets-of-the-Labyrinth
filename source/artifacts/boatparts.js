const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Boat Parts",
	"For the first @{copies+1} rounds of combat, delvers gain @{copies*25+25} block.",
	"Increase the number of rounds by 1 and block gained by 25 for each set of parts",
	"Untyped"
).setFlavorText({ name: "*Additional Notes*", value: "Odysseus would be proud." });

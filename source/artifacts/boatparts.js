const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Boat Parts",
	"For the first @{copies+1} rounds of combat, delvers gain @{copies*25+25} protection.",
	"Increase the number of rounds by 1 and protection gained by 25 for each set of parts",
	"Earth"
).setFlavorText({ name: "*Additional Notes*", value: "Odysseus would be proud." });

const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Boat Parts",
	"For the first @{copies+1} rounds of combat, delvers gain 25 protection.",
	"Increase the number of rounds by 1 for each set of parts",
	"Earth",
	300
).setFlavorText({ name: "*Additional Notes*", value: "Odysseus would be proud." });

const { ArtifactTemplate } = require("../classes");
const { MAX_BUTTONS_PER_ROW } = require("../constants");

module.exports = new ArtifactTemplate("Enchanted Map",
	"When picking rooms, roll @{copies} more option(s).",
	`Increase number of rolls by 1 per map (duplicate rolls possible, ${MAX_BUTTONS_PER_ROW} unique options max)`,
	"Darkness",
	300
).setFlavorText({ name: "*Additional Notes*", value: "*Makes routing real ez*" })

const { InteractionLimits } = require("@sapphire/discord.js-utilities");
const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Enchanted Map",
	"When picking rooms, roll @{copies} more option(s).",
	`Increase number of rolls by 1 per map (duplicate rolls possible, ${InteractionLimits.MaximumButtonsPerActionRow} unique options max)`,
	"Darkness",
	300
).setFlavorText({ name: "*Additional Notes*", value: "*Makes routing real ez*" })

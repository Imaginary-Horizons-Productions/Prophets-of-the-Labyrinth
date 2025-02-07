const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Bejeweld Treasuresphere",
	"Increase the adventure's score by @{copies*25}%.",
	"Increase the score bonus percent by 25 per sphere",
	"Unaligned",
	300
);

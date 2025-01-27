const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Can't Hold All this Value",
	"Reduce the number of pieces of gear a delver can carry by @{intensity} (minimum: 1). If they have more than that, the last gear in their list will be dropped first.",
	1,
	true,
	true
).setScoreMultiplier(1.2);

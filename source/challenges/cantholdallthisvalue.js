const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Can't Hold All this Value",
	"Reduce the number of pieces of gear a delver can carry by @{intensity}.",
	1,
	true,
	true
).setScoreMultiplier(1.2);

const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Can't Hold All this Value",
	"Reduce the pieces of equipment a delver can carry by @{intensity}.",
	1
)
	.setScoreMultiplier(1.2);

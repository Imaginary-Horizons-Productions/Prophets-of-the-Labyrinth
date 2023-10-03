const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Restless",
	"Reduce hp recovered at rest sites by @{intensity}%.",
	30
).setScoreMultiplier(1.5);

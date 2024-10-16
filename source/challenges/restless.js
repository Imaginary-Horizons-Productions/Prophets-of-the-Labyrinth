const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Restless",
	"Reduce HP recovered at rest sites by @{intensity}%.",
	30,
	true,
	true
).setScoreMultiplier(1.5);

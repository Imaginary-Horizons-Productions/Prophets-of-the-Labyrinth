const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Rushing",
	"There's a @{intensity}% chance room type will be unknown.",
	25,
	true,
	true
).setScoreMultiplier(1.5);

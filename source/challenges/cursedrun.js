const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Cursed Run",
	"One of your starting gear pieces is randomly replaced with cursed gear.",
	1,
	true,
	false
).setScoreMultiplier(2);

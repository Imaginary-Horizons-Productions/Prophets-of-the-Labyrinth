const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("name",
	"description",
	1,
	true,
	true
).setDuration(1)
	.setScoreMultiplier(1)
	.setReward(1)
	.setCompleteEffect(
		function (adventure, thread) {
			// rewards provided on completion of challenge
			thread.send({ content: `Having completed *${module.exports.name}*, the party gains ${reward} gold!` });
		}
	);

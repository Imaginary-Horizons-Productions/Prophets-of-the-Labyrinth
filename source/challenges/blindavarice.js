const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Blind Avarice",
	"Predicting costs @{intensity} gold for @{duration} rooms. Afterwards, gain @{reward} gold.",
	4
)
	.setDuration(3)
	.setScoreMultiplier(1.1)
	.setReward(500)
	.setCompleteEffect(
		function (adventure, thread) {
			const { reward } = adventure.challenges[module.exports.name];
			adventure.gainGold(reward);
			thread.send({ content: `Having completed *${module.exports.name}*, the party gains ${reward} gold!` });
		}
	);

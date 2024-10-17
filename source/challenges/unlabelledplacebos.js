const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Unlabelled Placebos",
	"Items only have a 1/@{intensity} chance of having their effect for @{duration} rooms. Afterwards gain @{reward} gold.",
	2,
	true,
	true
).setDuration(3)
	.setScoreMultiplier(1.1)
	.setReward(250)
	.setCompleteEffect(
		function (adventure, thread) {
			const { reward } = adventure.challenges[module.exports.name];
			adventure.gainGold(reward);
			thread.send({ content: `Having completed *${module.exports.name}*, the party gains ${reward} gold!` });
		}
	);

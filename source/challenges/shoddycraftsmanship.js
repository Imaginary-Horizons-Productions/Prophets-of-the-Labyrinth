const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Shoddy Craftsmanship",
	`For the next @{duration} rooms, gear you acquire has reduced durability reduced by @{intensity}%. Afterwards gain @{reward} gold.`,
	25,
	true,
	true
).setDuration(5)
	.setScoreMultiplier(1.2)
	.setReward(250)
	.setCompleteEffect(
		function (adventure, thread) {
			const { reward } = adventure.challenges[module.exports.name];
			adventure.gainGold(reward);
			thread.send({ content: `Having completed *${module.exports.name}*, the party gains ${reward} gold!` });
		}
	);

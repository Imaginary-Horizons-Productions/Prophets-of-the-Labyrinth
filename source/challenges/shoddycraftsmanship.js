const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Shoddy Craftsmanship",
	`For @{duration} rooms, new gear's durability is reduced by @{intensity}%. Then gain @{reward} gold.`,
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

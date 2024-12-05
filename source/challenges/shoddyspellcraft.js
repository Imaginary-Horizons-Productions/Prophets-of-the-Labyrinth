const { italic } = require("discord.js");
const { ChallengeTemplate } = require("../classes");

module.exports = new ChallengeTemplate("Shoddy Spellcraft",
	`For @{duration} rooms, new Spells have @{intensity}% fewer charges. Then gain @{reward} gold.`,
	50,
	true,
	true
).setDuration(5)
	.setScoreMultiplier(1.2)
	.setReward(250)
	.setCompleteEffect(
		function (adventure, thread) {
			const { reward } = adventure.challenges[module.exports.name];
			adventure.gainGold(reward);
			thread.send({ content: `Having completed ${italic(module.exports.name)}, the party gains ${reward} gold!` });
		}
	);

const { ChallengeTemplate } = require("../classes");
const { levelUp } = require("../util/delverUtil");

module.exports = new ChallengeTemplate("Training Weights",
	"Start combat with @{intensity} @e{Torpidity} and @e{Exposure} for @{duration} rooms. Afterwards, everyone gains @{reward} levels.",
	4,
	true,
	true
).setDuration(5)
	.setScoreMultiplier(1.1)
	.setReward(3)
	.setCompleteEffect(
		function (adventure, thread) {
			const { reward } = adventure.challenges[module.exports.name];
			adventure.delvers.forEach(delver => {
				levelUp(delver, reward, adventure);
			})

			thread.send({ content: `Having completed *${module.exports.name}*, the party gains ${reward} levels!` });
		}
	);

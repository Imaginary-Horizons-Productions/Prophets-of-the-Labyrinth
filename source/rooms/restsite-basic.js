const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");

module.exports = new RoomTemplate("Rest Site",
	"@{adventure}",
	"The room contains a rest site... and a mysterious challenger hanging out in the corner.",
	[
		new ResourceTemplate("n", "internal", "roomAction"),
		new ResourceTemplate("2", "internal", "challenge")
	]
).setBuildUI(
	function (adventure) {
		const healPercent = Math.trunc(30 * (1 - (adventure.getChallengeIntensity("Restless") / 100)));
		return [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId(`rest${SAFE_DELIMITER}${healPercent}`)
					.setLabel(`Rest [+${healPercent}% hp]`)
					.setEmoji("1️⃣")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId("viewchallenges")
					.setLabel("Take a challenge")
					.setEmoji("1️⃣")
					.setStyle(ButtonStyle.Danger)
			)
		]
	}
);

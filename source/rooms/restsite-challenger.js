const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Rest Site: Mysterious Challenger",
	"@{adventure}",
	"The room contains a campfire... and a mysterious challenger hanging out in the corner.",
	[
		new ResourceTemplate("n", "internal", "roomAction"),
		new ResourceTemplate("2", "internal", "challenge")
	],
	function (roomEmbed, adventure) {
		const healPercent = Math.trunc(30 * (1 - (adventure.getChallengeIntensity("Restless") / 100)));
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`rest${SAFE_DELIMITER}${healPercent}`)
						.setLabel(`Rest [+${healPercent}% hp]`)
						.setEmoji("1️⃣")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder().setCustomId("viewchallenges")
						.setLabel("Take a challenge")
						.setEmoji("1️⃣")
						.setStyle(ButtonStyle.Danger)
				),
				generateRoutingRow(adventure)
			]
		}
	}
);

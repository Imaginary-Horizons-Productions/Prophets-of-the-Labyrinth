const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Repair Kit, just hanging out",
	"Earth",
	"There's a Repair Kit hanging in the middle of the room tied to the ceiling by a rope.",
	[
		new ResourceTemplate("1", "internal", "Repair Kit").setCostExpression("0")
	],
	function (roomEmbed, adventure) {
		const wasRepairKitTaken = "Repair Kit taken" in adventure.room.resources;
		const isRepairKitRemaining = adventure.room.resources["Repair Kit"].count > 0;
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("freerepairkit")
						.setLabel(isRepairKitRemaining ? "Save the Repair Kit" : wasRepairKitTaken ? "Repair Kit saved" : "Repair Kit used")
						.setEmoji(isRepairKitRemaining ? "🔧" : wasRepairKitTaken ? "✔️" : "✖️")
						.setDisabled(!isRepairKitRemaining)
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder().setCustomId("repairkittinker")
						.setLabel(isRepairKitRemaining ? "Use the Repair Kit for a random random upgrade" : wasRepairKitTaken ? "Repair Kit saved" : "Repair Kit used")
						.setEmoji(isRepairKitRemaining ? "⬆️" : wasRepairKitTaken ? "✖️" : "✔️")
						.setDisabled(!isRepairKitRemaining)
						.setStyle(ButtonStyle.Primary)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

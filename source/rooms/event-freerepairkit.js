const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Repair Kit, just hanging out",
	"Earth",
	"There's a Spellbook Repair Kit hanging in the middle of the room tied to the ceiling by a rope.",
	[
		new ResourceTemplate("1", "internal", "Spellbook Repair Kit")
	],
	function (adventure) {
		adventure.room.history = {
			"Upgrades": []
		};
	},
	function (roomEmbed, adventure) {
		let saveEmoji, saveLabel, tinkerEmoji, tinkerLabel;
		const isRepairKitRemaining = "Spellbook Repair Kit" in adventure.room.resources;
		if (isRepairKitRemaining) {
			saveEmoji = "🔧";
			saveLabel = "Save the Repair Kit";
			tinkerEmoji = "⬆️";
			tinkerLabel = "Use the Repair Kit for a random random upgrade";
		} else {
			if (adventure.room.history.Upgrades.length > 0) {
				const [user, upgrade] = adventure.room.history.Upgrades[0];
				saveEmoji = "✖️";
				saveLabel = "Repair Kit used";
				tinkerEmoji = "✔️";
				tinkerLabel = `${upgrade} for ${user}`;
			} else {
				saveEmoji = "✔️";
				saveLabel = "Repair Kit saved";
				tinkerEmoji = "✖️";
				tinkerLabel = "Upgrade skipped";
			}
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("freerepairkit")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(saveEmoji)
						.setLabel(saveLabel)
						.setDisabled(!isRepairKitRemaining),
					new ButtonBuilder().setCustomId("repairkittinker")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(tinkerEmoji)
						.setLabel(tinkerLabel)
						.setDisabled(!isRepairKitRemaining)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

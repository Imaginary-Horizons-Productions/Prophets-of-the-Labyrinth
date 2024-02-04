const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Repair Kit, just hanging out",
	"Earth",
	"There's a Repair Kit hanging in the middle of the room tied to the ceiling by a rope.",
	[
		new ResourceTemplate("1", "internal", "Repair Kit")
	],
	function (roomEmbed, adventure) {
		let saveEmoji, saveLabel, tinkerEmoji, tinkerLabel;
		const isRepairKitRemaining = "Repair Kit" in adventure.room.resources;
		if (isRepairKitRemaining) {
			saveEmoji = "🔧";
			saveLabel = "Save the Repair Kit";
			tinkerEmoji = "⬆️";
			tinkerLabel = "Use the Repair Kit for a random random upgrade";
		} else {
			const upgradeResource = Object.values(adventure.room.resources).find(resource => resource.name.includes(": "));
			if (upgradeResource) {
				const [user, upgrade] = upgradeResource.name.split(": ")
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
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
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

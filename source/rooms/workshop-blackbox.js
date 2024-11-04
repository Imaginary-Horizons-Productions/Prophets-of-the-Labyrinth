const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Workshop with Black Box",
	"@{adventure}",
	"Workshop",
	"In this workshop there's a black box with a gear-shaped keyhole on the front. You figure it's designed to trade a piece of your gear for a Rare piece of gear.",
	[
		new ResourceTemplate("n", "internal", "roomAction"),
		new ResourceTemplate("1", "internal", "gear").setTier("Rare").setCostExpression("0")
	],
	function (adventure) {
		return {
			"Upgraders": [],
			"Repairers": [],
			"Traded for box": []
		};
	},
	function (roomEmbed, adventure) {
		let upgradeEmoji, upgradeLabel, isUpgradeDisabled, repairEmoji, repairLabel, isRepairDisabled, boxEmoji, boxLabel, isBoxDisabled;
		if (adventure.room.hasResource("roomAction")) {
			upgradeEmoji = "1️⃣";
			upgradeLabel = "Consider gear upgrades";
			isUpgradeDisabled = false;
			repairEmoji = "1️⃣";
			repairLabel = "Plan gear repairs";
			isRepairDisabled = false;
		} else {
			upgradeEmoji = adventure.room.history.Upgraders.length > 0 ? "✔️" : "✖️";
			upgradeLabel = "Out of supplies";
			isUpgradeDisabled = true;
			repairEmoji = adventure.room.history.Repairers.length > 0 ? "✔️" : "✖️";
			repairLabel = "Out of supplies";
			isRepairDisabled = true;
		}

		if (adventure.room.history["Traded for box"].length < 1) {
			boxEmoji = "0️⃣";
			boxLabel = "Open the black box";
			isBoxDisabled = false;
		} else {
			boxEmoji = "✔️";
			boxLabel = `${adventure.room.history["Traded for box"][0]} traded`;
			isBoxDisabled = true;
		}
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("upgrade")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(upgradeEmoji)
						.setLabel(upgradeLabel)
						.setDisabled(isUpgradeDisabled),
					new ButtonBuilder().setCustomId("repair")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(repairEmoji)
						.setLabel(repairLabel)
						.setDisabled(isRepairDisabled),
					new ButtonBuilder().setCustomId("blackbox")
						.setStyle(ButtonStyle.Success)
						.setEmoji(boxEmoji)
						.setLabel(boxLabel)
						.setDisabled(isBoxDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

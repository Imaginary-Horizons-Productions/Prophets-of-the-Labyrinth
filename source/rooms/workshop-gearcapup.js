const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");
const { MAX_MESSAGE_ACTION_ROWS } = require("../constants");

module.exports = new RoomTemplate("Tanning Workshop",
	"@{adventure}",
	"This workshop contains various leatherworking tools. You could make some bags, bandoliers, or holsters for the party go carry more gear.",
	[
		new ResourceTemplate("n", "internal", "roomAction")
	],
	function (adventure) {
		return {
			"Upgraders": [],
			"Repairers": [],
			"Cap boosters": []
		};
	},
	function (roomEmbed, adventure) {
		let upgradeEmoji, upgradeLabel, isUpgradeDisabled, repairEmoji, repairLabel, isRepairDisabled, capUpEmoji, capUpLabel, isCapUpDisabled;
		if (adventure.room.hasResource("roomAction")) {
			upgradeEmoji = "1️⃣";
			upgradeLabel = "Consider gear upgrades";
			isUpgradeDisabled = false;
			repairEmoji = "1️⃣";
			repairLabel = "Plan gear repairs";
			isRepairDisabled = false;
			if (adventure.gearCapacity < MAX_MESSAGE_ACTION_ROWS) {
				capUpEmoji = "1️⃣";
				capUpLabel = "Increase party Gear Capacity";
				isCapUpDisabled = false;
			} else {
				capUpEmoji = "✖️";
				capUpLabel = "Max Gear Capacity";
				isCapUpDisabled = true;
			}
		} else {
			upgradeEmoji = adventure.room.history.Upgraders.length > 0 ? "✔️" : "✖️";
			upgradeLabel = "Out of supplies";
			isUpgradeDisabled = true;
			repairEmoji = adventure.room.history.Repairers.length > 0 ? "✔️" : "✖️";
			repairLabel = "Out of supplies";
			isRepairDisabled = true;
			capUpEmoji = adventure.room.history["Cap boosters"].length > 0 ? "✔️" : "✖️";
			capUpLabel = "Out of supplies";
			isCapUpDisabled = true;
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
					new ButtonBuilder().setCustomId("viewrepairs")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(repairEmoji)
						.setLabel(repairLabel)
						.setDisabled(isRepairDisabled),
					new ButtonBuilder().setCustomId("gearcapup")
						.setStyle(ButtonStyle.Success)
						.setEmoji(capUpEmoji)
						.setLabel(capUpLabel)
						.setDisabled(isCapUpDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

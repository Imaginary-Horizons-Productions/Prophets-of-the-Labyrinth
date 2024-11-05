const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");
const { MAX_MESSAGE_ACTION_ROWS } = require("../constants");

module.exports = new RoomTemplate("Tanning Workshop",
	"@{adventure}",
	"This workshop contains various leatherworking tools. You could make some bags, bandoliers, or holsters for the party to carry more gear.",
	[],
	function (adventure) {
		let pendingActions = adventure.delvers.length;
		const hammerCount = adventure.getArtifactCount("Best-in-Class Hammer");
		if (hammerCount > 0) {
			pendingActions += hammerCount;
			adventure.updateArtifactStat("Best-in-Class Hammer", "Extra Room Actions", hammerCount);
		}
		adventure.room.actions = pendingActions;

		adventure.room.history = {
			"Upgraders": [],
			"Repairers": [],
			"Cap boosters": []
		};
	},
	function (roomEmbed, adventure) {
		let upgradeEmoji, upgradeLabel, isUpgradeDisabled, repairEmoji, repairLabel, isRepairDisabled, capUpEmoji, capUpLabel, isCapUpDisabled;
		if (adventure.room.actions > 0) {
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
					new ButtonBuilder().setCustomId("repair")
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

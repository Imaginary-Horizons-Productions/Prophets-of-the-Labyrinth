const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
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
			"Rechargers": [],
			"Cap boosters": []
		};
	},
	function (roomEmbed, adventure) {
		let upgradeEmoji, isUpgradeDisabled, repairEmoji, isRepairDisabled, capUpEmoji, capUpLabel, isCapUpDisabled;
		if (adventure.room.actions > 0) {
			upgradeEmoji = "⬆️";
			isUpgradeDisabled = false;
			repairEmoji = "🛠️";
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
			isUpgradeDisabled = true;
			repairEmoji = adventure.room.history.Rechargers.length > 0 ? "✔️" : "✖️";
			isRepairDisabled = true;
			capUpEmoji = adventure.room.history["Cap boosters"].length > 0 ? "✔️" : "✖️";
			if (adventure.gearCapacity < MAX_MESSAGE_ACTION_ROWS) {
				capUpLabel = "Increase party Gear Capacity";
			} else {
				capUpLabel = "Max Gear Capacity";
			}
			isCapUpDisabled = true;
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("upgrade")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(upgradeEmoji)
						.setLabel("Upgrade gear")
						.setDisabled(isUpgradeDisabled),
					new ButtonBuilder().setCustomId("Recharge")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(repairEmoji)
						.setLabel("Recharge a Spell")
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

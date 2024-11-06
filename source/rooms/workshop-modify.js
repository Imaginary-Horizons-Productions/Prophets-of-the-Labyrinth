const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Abandoned Forge",
	"@{adventure}",
	"The forge in this room could be used to modify some of your upgraded gear to change its form.",
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
			"Tinkerers": []
		};
	},
	function (roomEmbed, adventure) {
		let upgradeEmoji, isUpgradeDisabled, repairEmoji, isRepairDisabled, tinkerEmoji, isTinkerDisabled;
		if (adventure.room.actions > 0) {
			upgradeEmoji = "⬆️";
			isUpgradeDisabled = false;
			repairEmoji = "🛠️";
			isRepairDisabled = false;
			tinkerEmoji = "↔️";
			isTinkerDisabled = false;
		} else {
			upgradeEmoji = adventure.room.history.Upgraders.length > 0 ? "✔️" : "✖️";
			isUpgradeDisabled = true;
			repairEmoji = adventure.room.history.Repairers.length > 0 ? "✔️" : "✖️";
			isRepairDisabled = true;
			tinkerEmoji = adventure.room.history.Tinkerers.length > 0 ? "✔️" : "✖️";
			isTinkerDisabled = true;
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
					new ButtonBuilder().setCustomId("repair")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(repairEmoji)
						.setLabel("Repair gear")
						.setDisabled(isRepairDisabled),
					new ButtonBuilder().setCustomId("modify")
						.setStyle(ButtonStyle.Success)
						.setEmoji(tinkerEmoji)
						.setLabel("Modify gear")
						.setDisabled(isTinkerDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

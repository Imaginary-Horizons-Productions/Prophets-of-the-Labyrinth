const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Workshop with Black Box",
	"@{adventure}",
	"This is a normal, fully-stocked workshop... with a mysterious black box off to the side.",
	[
		new ResourceTemplate("1", "internal", "Gear").setTier("Rare").setCostExpression("0")
	],
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
			"Traded for box": []
		};
	},
	function (roomEmbed, adventure) {
		let upgradeEmoji, isUpgradeDisabled, repairEmoji, isRepairDisabled, boxEmoji, isBoxDisabled;
		if (adventure.room.actions > 0) {
			upgradeEmoji = "⬆️";
			isUpgradeDisabled = false;
			repairEmoji = "🛠️";
			isRepairDisabled = false;
		} else {
			upgradeEmoji = adventure.room.history.Upgraders.length > 0 ? "✔️" : "✖️";
			isUpgradeDisabled = true;
			repairEmoji = adventure.room.history.Repairers.length > 0 ? "✔️" : "✖️";
			isRepairDisabled = true;
		}

		if (adventure.room.history["Traded for box"].length < 1) {
			boxEmoji = "◼";
			isBoxDisabled = false;
		} else {
			boxEmoji = "✔️";
			isBoxDisabled = true;
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
					new ButtonBuilder().setCustomId("blackbox")
						.setStyle(ButtonStyle.Success)
						.setEmoji(boxEmoji)
						.setLabel("A black box?")
						.setDisabled(isBoxDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

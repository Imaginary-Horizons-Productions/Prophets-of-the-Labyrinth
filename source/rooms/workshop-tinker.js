const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Abandoned Forge",
	"@{adventure}",
	"The forge in this room could be used to recast some of your upgraded gear to change it's form.",
	[
		new ResourceTemplate("n", "internal", "roomAction")
	],
	function (adventure) {
		return {
			"Upgraders": [],
			"Repairers": [],
			"Tinkerers": []
		};
	},
	function (roomEmbed, adventure) {
		let upgradeEmoji, upgradeLabel, isUpgradeDisabled, repairEmoji, repairLabel, isRepairDisabled, tinkerEmoji, tinkerLabel, isTinkerDisabled;
		if (adventure.room.hasResource("roomAction")) {
			upgradeEmoji = "1️⃣";
			upgradeLabel = "Consider gear upgrades";
			isUpgradeDisabled = false;
			repairEmoji = "1️⃣";
			repairLabel = "Plan gear repairs";
			isRepairDisabled = false;
			tinkerEmoji = "1️⃣";
			tinkerLabel = "Tinker with your gear";
			isTinkerDisabled = false;
		} else {
			upgradeEmoji = adventure.room.history.Upgraders.length > 0 ? "✔️" : "✖️";
			upgradeLabel = "Out of supplies";
			isUpgradeDisabled = true;
			repairEmoji = adventure.room.history.Repairers.length > 0 ? "✔️" : "✖️";
			repairLabel = "Out of supplies";
			isRepairDisabled = true;
			tinkerEmoji = adventure.room.history.Tinkerers.length > 0 ? "✔️" : "✖️";
			tinkerLabel = "Out of supplies";
			isTinkerDisabled = true;
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
					new ButtonBuilder().setCustomId("tinker")
						.setStyle(ButtonStyle.Success)
						.setEmoji(tinkerEmoji)
						.setLabel(tinkerLabel)
						.setDisabled(isTinkerDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { ICON_CONFIRM, ICON_CANCEL, ICON_MODIFY, ICON_UPGRADE } = require("../constants");

module.exports = new RoomTemplate("Abandoned Forge",
	"@{adventure}",
	"The forge in this room could be used to modify some of your upgraded gear to change its form.",
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
			"Modders": []
		};
		return [];
	},
	function (roomEmbed, adventure) {
		let upgradeEmoji, isUpgradeDisabled, modifyEmoji, isModifyDisabled;
		if (adventure.room.actions > 0) {
			upgradeEmoji = ICON_UPGRADE;
			isUpgradeDisabled = false;
			modifyEmoji = ICON_MODIFY;
			isModifyDisabled = false;
		} else {
			upgradeEmoji = adventure.room.history.Upgraders.length > 0 ? ICON_CONFIRM : ICON_CANCEL;
			isUpgradeDisabled = true;
			modifyEmoji = adventure.room.history.Modders.length > 0 ? ICON_CONFIRM : ICON_CANCEL;
			isModifyDisabled = true;
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("upgrade")
						.setStyle(ButtonStyle.Success)
						.setEmoji(upgradeEmoji)
						.setLabel("Upgrade gear")
						.setDisabled(isUpgradeDisabled),
					new ButtonBuilder().setCustomId("modify")
						.setStyle(ButtonStyle.Success)
						.setEmoji(modifyEmoji)
						.setLabel("Modify gear")
						.setDisabled(isModifyDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

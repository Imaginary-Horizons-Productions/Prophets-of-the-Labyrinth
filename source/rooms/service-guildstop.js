const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { pathVoteField, generateRoutingRow } = require("../util/messageComponentUtil");
const { SAFE_DELIMITER } = require("../constants");
const { rollChallenges } = require("../challenges/_challengeDictionary");

module.exports = new RoomTemplate("Guildstop: For All Your Adventuring Needs",
	"@{adventure}",
	"The Adventurer's Guild has a contact point setup inside the dungeon. Specialization and Pet switching services are offered formally, while the gathering of other adventurers provides the opportunity to take on new challenges.",
	function (adventure) {
		rollChallenges(2, adventure).forEach(challenge => {
			adventure.room.addResource(challenge, "challenge", "internal", 1);
		})
		adventure.room.history = {
			"New challenges": []
		};
		return [];
	},
	function (roomEmbed, adventure) {
		const specializationSwitchCost = 50;
		const petSwitchCost = 50;
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`switchspecialization${SAFE_DELIMITER}${specializationSwitchCost}`)
						.setEmoji("🆔")
						.setLabel(`${specializationSwitchCost}g: Switch Specializations`)
						.setStyle(ButtonStyle.Primary)
						.setDisabled(adventure.gold < specializationSwitchCost),
					new ButtonBuilder().setCustomId(`switchpet${SAFE_DELIMITER}${petSwitchCost}`)
						.setEmoji("🐾")
						.setLabel(`${petSwitchCost}g: Switch Pets`)
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(adventure.gold < petSwitchCost),
					new ButtonBuilder().setCustomId("challenges")
						.setStyle(ButtonStyle.Danger)
						.setEmoji("🏆")
						.setLabel("Take on a Challenge")
						.setDisabled(adventure.room.history["New challenges"].length > 0)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new RoomTemplate("Imp Contract Faire",
	"@{adventureWeakness}",
	"The next room contains several stalls with imps hawking suspicious contracts. One imp offers a lucrative opportunity (*given you allow your element to be changed to @{roomElement}). Another offers a sketcy procedure for improving party health.",
	[],
	function (adventure) {
		adventure.room.history = {
			"HP Donor": []
		};
	},
	function (roomEmbed, adventure) {
		let swapEmoji, swapLabel, isSwapDisabled, shareEmoji, shareLabel, isShareDisabled;
		swapEmoji = getEmoji(adventure.room.element);
		isSwapDisabled = !adventure.delvers.some(delver => delver.element !== adventure.room.element);
		if (isSwapDisabled) {
			swapLabel = "No eligible delvers";
		} else {
			swapLabel = `Change element [+200g, change to ${adventure.room.element}]`;
		}

		if (adventure.room.history["HP Donor"].length < 1) {
			shareEmoji = "❤️";
			shareLabel = "Share HP [-50g, -100 HP, +100 HP for everyone else]";
			isShareDisabled = adventure.gold < 50;
		} else {
			shareEmoji = "✔️";
			shareLabel = `${adventure.room.history["HP Donor"][0]} shared HP`;
			isShareDisabled = true;
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("elementresearch")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(swapEmoji)
						.setLabel(swapLabel)
						.setDisabled(isSwapDisabled)
				),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("hpshare")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(shareEmoji)
						.setLabel(shareLabel)
						.setDisabled(isShareDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);

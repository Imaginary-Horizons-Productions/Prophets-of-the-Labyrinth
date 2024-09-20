const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new RoomTemplate("Imp Contract Faire",
	"@{adventureWeakness}",
	"Event",
	"The next room contains several stalls with imps hawking suspicious contracts. One imp offers a lucrative opportunity (*given you allow your element to be changed to @{roomElement}). Another offers a sketcy procedure for improving party health.",
	[],
	function (adventure) {
		return {
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
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
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

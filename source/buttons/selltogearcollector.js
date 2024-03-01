const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET, SKIP_INTERACTION_HANDLING } = require('../constants');
const { renderRoom } = require('../util/embedUtil');

const mainId = "selltogearcollector";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Create select with sellable gear options, higher price than merchant */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const pricePercent = 150;
		const saleOptions = delver.gear.map((gear, index) => {
			const gearPrice = Math.floor(getGearProperty(gear.name, "cost") * pricePercent / 100);
			return {
				label: gear.name,
				description: `${gearPrice}g`,
				value: index.toString()
			}
		});
		if (saleOptions.length > 0) {
			interaction.reply({
				content: "Seems like the Gear Collector is willing to pay extra for your gear.",
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}`)
							.setPlaceholder("Select a piece of gear to sell...")
							.setOptions(saleOptions)
					)
				],
				ephemeral: true,
				fetchReply: true
			}).then(reply => {
				const collector = reply.createMessageComponentCollector({ max: 1 });
				collector.on("collect", collectedIntearction => {
					const [_, startedDepth] = collectedIntearction.customId.split(SAFE_DELIMITER);
					const adventure = getAdventure(collectedIntearction.channelId);
					const actionCost = 1;
					if (startedDepth !== adventure.depth.toString() || !adventure.room.hasResource("roomAction", actionCost)) {
						return;
					}

					adventure.room.decrementResource("roomAction", actionCost);
					const [saleIndex] = collectedIntearction.values;
					const delver = adventure.delvers.find(delver => delver.id === collectedIntearction.user.id);
					const gearName = delver.gear[saleIndex].name;
					let price = Math.floor(pricePercent / 100 * getGearProperty(gearName, "cost"));
					delver.gear.splice(saleIndex, 1);
					adventure.gainGold(price);
					setAdventure(adventure);
					collectedIntearction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
						roomMessage.edit(renderRoom(adventure, collectedIntearction.channel));
					})
					collectedIntearction.channel.send(`**${collectedIntearction.member.displayName}** sells their ${gearName} for ${price}g.`);
				})

				collector.on("end", () => {
					interaction.deleteReply();
				})
			})
		} else {
			interaction.reply({
				content: "Seems like the Gear Collector is willing to pay extra for your gear.",
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}`)
							.setPlaceholder("No gear to sell...")
							.setOptions(EMPTY_SELECT_OPTION_SET)
							.setDisabled(true)
					)
				],
				ephemeral: true
			})
		}
	}
);

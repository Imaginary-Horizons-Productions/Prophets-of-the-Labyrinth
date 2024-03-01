const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET, SKIP_INTERACTION_HANDLING } = require('../constants');
const { renderRoom } = require('../util/embedUtil');

const mainId = "sellgear";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Create select with sellable gear options */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const pricePercent = 50;
		const saleOptions = delver.gear.map((gear, index) => {
			const maxDurability = getGearProperty(gear.name, "maxDurability");
			if (maxDurability > 0) {
				return {
					label: `${gear.name} (${gear.durability}/${maxDurability})`,
					description: `${Math.floor(getGearProperty(gear.name, "cost") * pricePercent / 100 * gear.durability / maxDurability)}g`,
					value: index.toString()
				};
			} else {
				return {
					label: `${gear.name}`,
					description: `${Math.floor(getGearProperty(gear.name, "cost") * pricePercent / 100)}g`,
					value: index.toString()
				};
			}
		});
		if (saleOptions.length > 0) {
			interaction.reply({
				content: "The Merchant marks down the price for the damage on the gear.",
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
				collector.on("collect", collectedInteraction => {
					const [_, startedDepth] = collectedInteraction.customId.split(SAFE_DELIMITER);
					const adventure = getAdventure(collectedInteraction.channelId);
					if (adventure?.depth.toString() !== startedDepth) {
						return;
					}

					const [saleIndex] = collectedInteraction.values;
					const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
					const gearName = delver.gear[saleIndex].name;
					let price = pricePercent / 100 * getGearProperty(gearName, "cost");
					const maxDurability = getGearProperty(gearName, "maxDurability");
					if (maxDurability > 0) {
						price *= (delver.gear[saleIndex].durability / maxDurability);
					}
					price = Math.floor(price);
					delver.gear.splice(saleIndex, 1);
					adventure.gainGold(price);
					setAdventure(adventure);
					collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
						roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
						collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}** sells their ${gearName} for ${price}g.`);
					})
				})

				collector.on("end", () => {
					interaction.deleteReply();
				})
			})
		} else {
			interaction.reply({
				content: "The Merchant marks down the price for the damage on the gear.",
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

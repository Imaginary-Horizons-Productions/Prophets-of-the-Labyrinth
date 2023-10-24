const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getGearProperty } = require('../gear/_gearDictionary');
const { SAFE_DELIMITER, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { consumeRoomActions } = require('../util/messageComponentUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "treasure";
module.exports = new SelectWrapper(mainId, 3000,
	/** Move the selected loot into party/delver's inventory, then decrement a roomAction */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "There aren't any more treasure picks to use.", ephemeral: true });
			return;
		}

		const [name, index] = interaction.values[0].split(SAFE_DELIMITER);
		let result;
		const { type, count } = adventure.room.resources[name];
		if (count > 0) { // Prevents double message if multiple players take near same time
			if ("pickedTreasure" in adventure.room.state) {
				adventure.room.state.pickedTreasure.names.push(name);
			} else {
				adventure.room.state.pickedTreasure = { names: [name] };
			}
			switch (type) {
				case "gold":
					adventure.gainGold(count);
					adventure.room.resources[name].count = 0;
					result = {
						content: `The party acquires ${count} gold.`
					}
					break;
				case "artifact":
					adventure.gainArtifact(name, count);
					adventure.room.resources[name].count = 0;
					result = {
						content: `The party acquires ${name} x ${count}.`
					}
					break;
				case "gear":
					if (delver.gear.length < adventure.getGearCapacity()) {
						delver.gear.push({ name, durability: getGearProperty(name, "maxDurability") });
						adventure.room.resources[name].count = Math.max(count - 1, 0);
						result = {
							content: `${interaction.member.displayName} takes a ${name}. There are ${count - 1} remaining.`
						}
					} else {
						result = {
							content: `You can only carry ${adventure.getGearCapacity()} pieces of gear at a time. Pick one to replace with the ${name}:`,
							components: [new ActionRowBuilder().addComponents(delver.gear.map((gear, index) => {
								return new ButtonBuilder().setCustomId(`replacegear${SAFE_DELIMITER}${name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}true`)
									.setLabel(`Discard ${gear.name}`)
									.setStyle(ButtonStyle.Secondary)
							}))],
							ephemeral: true
						};
					}
					break;
				case "item":
					if (name in adventure.items) {
						adventure.items[name] += count;
					} else {
						adventure.items[name] = count;
					}
					adventure.room.resources[name].count = 0;
					result = {
						content: `The party acquires ${name} x ${count}.`
					}
					break;
			}
		}
		if (result) {
			setAdventure(adventure);
			interaction.reply(result).then(() => {
				const updatedMessage = renderRoom(adventure, interaction.channel);
				interaction.message.edit(
					{
						...updatedMessage,
						embeds: consumeRoomActions(adventure, updatedMessage.embeds, 1).embeds
					}
				);
			});
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);

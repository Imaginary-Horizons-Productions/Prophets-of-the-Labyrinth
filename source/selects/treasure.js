const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { buildGearRecord } = require('../gear/_gearDictionary');
const { SAFE_DELIMITER, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { renderRoom } = require('../util/embedUtil');

const mainId = "treasure";
module.exports = new SelectWrapper(mainId, 2000,
	/** End of combat loot or treasure room picks; decrement a room action in treasure rooms */
	(interaction, [source]) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		if (source === "treasure" && !adventure.room.hasResource("roomAction", 1)) {
			interaction.reply({ content: "There aren't any more treasure picks to use.", ephemeral: true });
			return;
		}

		const [name, index] = interaction.values[0].split(SAFE_DELIMITER);
		let result;
		if (adventure.room.hasResource(name)) { // Prevents double message if multiple players take near same time
			const { type, count } = adventure.room.resources[name];
			switch (type) {
				case "gold":
					adventure.gainGold(count);
					delete adventure.room.resources[name];
					result = {
						content: `The party acquires ${count} gold.`
					}
					break;
				case "artifact":
					adventure.gainArtifact(name, count);
					delete adventure.room.resources[name];
					result = {
						content: `The party acquires ${count} ${name}.`
					}
					break;
				case "gear":
					if (delver.gear.length < adventure.getGearCapacity()) {
						delver.gear.push(buildGearRecord(name, "max"));
						if (adventure.room.resources[name].count > 1) {
							adventure.room.resources[name].count--;
						} else {
							delete adventure.room.resources[name];
						}
						result = {
							content: `${interaction.member.displayName} takes a ${name}. There are ${count - 1} remaining.`
						}
					} else {
						result = {
							content: `You can only carry ${adventure.getGearCapacity()} pieces of gear at a time. Pick one to replace with the ${name}:`,
							components: [new ActionRowBuilder().addComponents(delver.gear.map((gear, index) => {
								return new ButtonBuilder().setCustomId(`replacegear${SAFE_DELIMITER}${name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}${source}`)
									.setLabel(`Discard ${gear.name}`)
									.setStyle(ButtonStyle.Secondary)
							}))],
							ephemeral: true
						};
					}
					break;
				case "item":
					adventure.gainItem(name, count);
					delete adventure.room.resources[name];
					result = {
						content: `The party acquires ${count} ${name}.`
					}
					break;
			}
		}
		if (result) {
			setAdventure(adventure);
			interaction.reply(result).then(() => {
				if (source === "treasure") {
					adventure.room.decrementResource("roomAction", 1);
					adventure.room.history["Treasure picked"].push(name);
				}
				interaction.message.edit(renderRoom(adventure, interaction.channel, interaction.message.embeds[0].description));
			});
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);

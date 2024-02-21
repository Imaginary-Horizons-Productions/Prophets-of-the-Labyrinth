const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING } = require('../constants');
const { trimForSelectOptionDescription, listifyEN } = require('../util/textUtil');
const { transformGear } = require('../util/delverUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "upgrade";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Present the user with an opportunity to upgrade a piece of gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (!adventure.room.hasResource("roomAction")) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const options = [];
		delver.gear.forEach((gear, index) => {
			const upgrades = getGearProperty(gear.name, "upgrades").map(upgrade => upgrade.replace(gear.name, "").trim());
			if (upgrades.length > 0) {
				options.push({
					label: gear.name,
					description: trimForSelectOptionDescription(`Possibilities: ${listifyEN(upgrades, true)}`),
					value: `${adventure.depth}${SAFE_DELIMITER}${index}`
				})
			}
		})
		if (options.length < 1) {
			interaction.reply({ content: "You don't have any gear that can be upgraded.", ephemeral: true });
			return;
		}

		interaction.deferReply({ ephemeral: true }).then(() => {
			return interaction.editReply({
				content: "You can use 1 room action to upgrade a piece of gear.",
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
							.setPlaceholder("Pick a piece of gear to randomly upgrade...")
							.setOptions(options)
					)
				]
			});
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(interaction.channelId);
				const [startingDepth, unparsedIndex] = collectedInteraction.values[0].split(SAFE_DELIMITER);
				if (!adventure.room.hasResource("roomAction") || startingDepth !== adventure.depth.toString()) {
					return;
				}

				const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
				const index = parseInt(unparsedIndex);
				const gearName = delver.gear[index].name;
				/** @type {string[]} */
				const upgradePool = getGearProperty(gearName, "upgrades");
				const upgradeName = upgradePool[adventure.generateRandomNumber(upgradePool.length, "general")];
				transformGear(delver, index, gearName, upgradeName);
				adventure.room.history.Upgraders.push(delver.name);
				adventure.room.decrementResource("roomAction", 1);
				setAdventure(adventure);
				interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					return roomMessage.edit(renderRoom(adventure, interaction.channel));
				})
				interaction.channel.send(`**${interaction.member.displayName}**'s *${gearName}* has been upgraded to **${upgradeName}**!`);
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		})
	}
);

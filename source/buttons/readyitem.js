const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper, CombatantReference, Move } = require('../classes');
const { SAFE_DELIMITER, MAX_SELECT_OPTIONS, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getAdventure, setAdventure, checkNextRound, endRound } = require('../orcustrators/adventureOrcustrator');
const { getColor } = require('../util/elementUtil');
const { randomAuthorTip } = require('../util/embedUtil');
const { getItem } = require('../items/_itemDictionary');
const { trimForSelectOptionDescription } = require('../util/textUtil');

const mainId = "readyitem";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Show the delver stats of the user and provide components to ready a move */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}
		interaction.deferReply({ ephemeral: true }).then(() => {
			return interaction.editReply({
				embeds: [
					new EmbedBuilder().setColor(getColor(adventure.room.element))
						.setAuthor(randomAuthorTip())
						.setTitle("Readying an Item")
						.setDescription("Using an item has priority (it'll happen before non-priority actions).\n\nPick one option from below as your move for this round:")
				],
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.room.round}`)
							.setPlaceholder("Pick an item...")
							.addOptions(Object.keys(adventure.items).slice(0, MAX_SELECT_OPTIONS).reduce((options, item) => options.concat({
								label: `${item} (Held: ${adventure.items[item]})`,
								description: trimForSelectOptionDescription(getItem(item).description),
								value: item
							}), [])))
				]
			});
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", (collectedInteraction) => {
				const adventure = getAdventure(collectedInteraction.channelId);
				const delver = adventure?.delvers.find(delver => delver.id === collectedInteraction.user.id);
				if (!delver) {
					return;
				}

				const round = collectedInteraction.customId.split(SAFE_DELIMITER)[1];
				if (adventure.room.round !== Number(round)) {
					return;
				}

				const [itemName] = collectedInteraction.values;
				const userIndex = adventure.getCombatantIndex(delver);
				// Filter out: item uses by self and enemy (only count own team)
				const committedCount = adventure?.room.moves.filter(move => move.name === itemName && move.userReference.team === delver.team && move.userReference.index !== userIndex).length;
				if (!(itemName in adventure?.items && adventure?.items[itemName] > committedCount)) {
					interaction.update({ content: `The party doesn't have any more ${itemName}(s) to use.`, embeds: [], components: [] });
					return;
				}

				// Add move to round list (overwrite exisiting readied move)
				const newMove = new Move(new CombatantReference(delver.team, userIndex), "item", false)
					.setSpeedByCombatant(delver)
					.setPriority(1)
					.setName(itemName);

				const item = getItem(itemName);
				item.selectTargets(delver, adventure).forEach(target => {
					newMove.addTarget(target);
				})
				let overwritten = false;
				for (let i = 0; i < adventure.room.moves.length; i++) {
					const { userReference } = adventure.room.moves[i];
					if (userReference.team === delver.team && userReference.index === userIndex) {
						adventure.room.moves.splice(i, 1);
						overwritten = true;
						break;
					}
				}
				adventure.room.moves.push(newMove);

				// Send confirmation text
				interaction.channel.send(`**${interaction.member.displayName}** ${overwritten ? "switches to ready" : "readies"} a(n) **${itemName}**.`).then(() => {
					setAdventure(adventure);
					if (checkNextRound(adventure)) {
						endRound(adventure, interaction.channel);
					}
				}).catch(console.error);
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		}).catch(console.error);
	}
);

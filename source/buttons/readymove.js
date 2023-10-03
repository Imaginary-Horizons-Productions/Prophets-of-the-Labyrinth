const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { SAFE_DELIMITER, MAX_MESSAGE_ACTION_ROWS } = require('../constants');
const { getEmoji, getColor } = require('../util/elementUtil');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getGearProperty } = require('../gear/_gearDictionary');
const { gearToEmbedField } = require('../util/embedUtil');
const { getArchetype } = require('../archetypes/_archetypeDictionary');

const mainId = "readymove";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Show the delver stats of the user and provide components to ready a move */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}
		if (delver.getModifierStacks("Stun") > 0) { // Early out if stunned
			interaction.reply({ content: "You cannot pick a move because you are stunned this round.", ephemeral: true });
			return;
		}
		const embed = new EmbedBuilder().setColor(getColor(adventure.room.element))
			.setTitle("Readying a Move")
			.setDescription(`Your ${getEmoji(delver.element)} moves add 1 Stagger to enemies and remove 1 Stagger from allies.\n\nPick one option from below as your move for this round:`)
			.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
		const enemyOptions = [];
		const miniPredictBuilder = getArchetype(delver.archetype).miniPredict;
		for (let i = 0; i < adventure.room.enemies.length; i++) {
			let enemy = adventure.room.enemies[i];
			if (enemy.hp > 0) {
				enemyOptions.push({
					label: enemy.getName(adventure.room.enemyIdMap),
					description: miniPredictBuilder(enemy),
					value: `enemy${SAFE_DELIMITER}${i}`
				})
			}
		}
		const delverOptions = adventure.delvers.map((ally, i) => {
			return {
				label: ally.name,
				description: miniPredictBuilder(ally),
				value: `delver${SAFE_DELIMITER}${i}`
			}
		});
		const components = [];
		const usableMoves = delver.gear.filter(gear => gear.durability > 0);
		if (usableMoves.length < MAX_MESSAGE_ACTION_ROWS) {
			usableMoves.unshift({ name: "Punch", durability: Infinity });
		}
		for (let i = 0; i < usableMoves.length; i++) {
			const { name: gearName, durability } = usableMoves[i];
			embed.addFields(gearToEmbedField(gearName, durability));
			const { target, team } = getGearProperty(gearName, "targetingTags");
			const elementEmoji = getEmoji(getGearProperty(gearName, "element"));
			if (target === "single") {
				// Select Menu
				let targetOptions = [];
				if (team === "enemy" || team === "any") {
					targetOptions = targetOptions.concat(enemyOptions);
				}

				if (team === "delver" || team === "any") {
					targetOptions = targetOptions.concat(delverOptions);
				}
				components.push(new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`movetarget${SAFE_DELIMITER}${gearName}${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}${i}`)
						.setPlaceholder(`${elementEmoji} Use ${gearName} on...`)
						.addOptions(targetOptions)
				));
			} else {
				// Button
				components.push(new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`confirmmove${SAFE_DELIMITER}${gearName}${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}${i}`)
						.setLabel(`Use ${gearName}`)
						.setEmoji(elementEmoji)
						.setStyle(ButtonStyle.Secondary)
				));
			}
		}
		interaction.reply({ embeds: [embed], components, ephemeral: true })
			.catch(console.error);
	}
);
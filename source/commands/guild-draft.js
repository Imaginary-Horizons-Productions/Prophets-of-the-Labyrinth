const { PermissionFlagsBits, InteractionContextType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, Colors, TextDisplayBuilder, ComponentType } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { ICON_CONFIRM, ICON_CANCEL, SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { getPlayer, setPlayer } = require('../orcustrators/playerOrcustrator');
const { timeConversion } = require('../util/mathUtil');
const { rollArchetypes } = require('../archetypes/_archetypeDictionary');
const { rollPets } = require('../pets/_petDictionary');

const customIdPrefix = `${SKIP_INTERACTION_HANDLING}${SAFE_DELIMITER}`;

const mainId = "guild-draft";
//TODONOW write description
module.exports = new CommandWrapper(mainId, "description", PermissionFlagsBits.ViewChannel, false, [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel], 3000,
	(interaction) => {
		const player = getPlayer(interaction.user.id, interaction.guild.id);
		const useFreeRoll = player.nextFreeRoll <= Date.now();
		if (!useFreeRoll && player.bonusDrafts < 1) {
			interaction.reply({ content: `You don't have any bonus drafts available at the moment. Your next free draft is in <t:${player.nextFreeRoll}:R>.`, flags: MessageFlags.Ephemeral });
			return;
		}

		const [firstArchetype, secondArchetype] = rollArchetypes(2, false);
		const [firstPet, secondPet] = rollPets(2, false);
		let selectedArchetype = null;
		let selectedPet = null;
		const influenceLabel = "Random (+10% Guild Influence)";
		/** @type {import('discord.js').APIContainerComponent} */
		const containerPayload = { type: ComponentType.Container, accent_color: Colors.Aqua };
		//TODONOW send message with instructions ("this will use one of your bonus drafts" if applicable, "randoms stack additively", "Pets max out at level 4", "Archetypes max out at level 4")
		const containerComponents = [new TextDisplayBuilder().setContent("# The Guild Draft\nplaceholder\n## Available Archetypes")];
		interaction.reply({
			components: [
				{
					...containerPayload,
					components: containerComponents.concat(
						new ActionRowBuilder().setComponents(
							new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}${firstArchetype}`)
								.setStyle(ButtonStyle.Primary)
								.setLabel(firstArchetype),
							new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}${secondArchetype}`)
								.setStyle(ButtonStyle.Primary)
								.setLabel(secondArchetype),
							new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}influence`)
								.setStyle(ButtonStyle.Secondary)
								.setLabel(influenceLabel)
						)
					)
				}
			],
			flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			withResponse: true
		}).then(response => response.resource.message).then(reply => {
			const archetypeCollector = reply.createMessageComponentCollector({ filter: (interaction) => interaction.customId.startsWith(`${customIdPrefix}0`), max: 1 });
			archetypeCollector.on("collect", collectedInteraction => {
				const [_, rowIndex, selection] = collectedInteraction.customId.split(SAFE_DELIMITER);
				selectedArchetype = selection;
				const disabledArchetypeRow = new ActionRowBuilder();
				for (const option of [firstArchetype, secondArchetype, "influence"]) {
					disabledArchetypeRow.addComponents(
						new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}${option}`)
							.setStyle(option === "influence" ? ButtonStyle.Secondary : ButtonStyle.Primary)
							.setEmoji(selection === option ? ICON_CONFIRM : ICON_CANCEL)
							.setLabel(option === "influence" ? influenceLabel : option)
							.setDisabled(true)
					)
				}
				//TODONOW create archetypeTips
				const archetypeTip = "placeholder arcehtype tip"
				containerComponents.push(disabledArchetypeRow, new TextDisplayBuilder().setContent(`-# ${archetypeTip}\n## Available Pets`));
				collectedInteraction.update({
					components: [
						{
							...containerPayload,
							components: containerComponents.concat(
								new ActionRowBuilder().addComponents(
									new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}${firstPet}`)
										.setStyle(ButtonStyle.Primary)
										.setLabel(firstPet),
									new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}${secondPet}`)
										.setStyle(ButtonStyle.Primary)
										.setLabel(secondPet),
									new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}influence`)
										.setStyle(ButtonStyle.Secondary)
										.setLabel(influenceLabel)
								)
							)
						}
					]
				});
			})

			const petCollector = reply.createMessageComponentCollector({ filter: (interaction) => interaction.customId.startsWith(`${customIdPrefix}1`), max: 1 });
			petCollector.on("collect", collectedInteraction => {
				const [_, rowIndex, selection] = collectedInteraction.customId.split(SAFE_DELIMITER);
				selectedPet = selection;
				const disabledPetRow = new ActionRowBuilder();
				for (const option of [firstPet, secondPet, "influence"]) {
					disabledPetRow.addComponents(
						new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}${option}`)
							.setStyle(option === "influence" ? ButtonStyle.Secondary : ButtonStyle.Primary)
							.setEmoji(selection === option ? ICON_CONFIRM : ICON_CANCEL)
							.setLabel(option === "influence" ? influenceLabel : option)
							.setDisabled(true)
					)
				}
				//TODONOW create petTips
				const petTip = "placeholder pet tip"
				containerComponents.push(disabledPetRow, new TextDisplayBuilder().setContent(`-# ${petTip}`));

				const influencePercent = [selectedArchetype, selectedPet].filter(selection => selection === "influence").length * 10;
				//TODONOW more secure RNG
				const influenceRoll = 100 * Math.random();
				const totalInfluence = Math.ceil(influenceRoll + (influenceRoll * influencePercent / 100));
				//TODONOW record selections onto player object
				player.guildInfluence += totalInfluence;
				if (useFreeRoll) {
					player.nextFreeRoll = Date.now() + timeConversion(1, "w", "ms");
				}
				setPlayer(player);
				containerComponents.push(new TextDisplayBuilder().setContent(`You gained ${totalInfluence} Guild Influence!`))
				collectedInteraction.update({
					components: [{ ...containerPayload, components: containerComponents }]
				});
			})
		})
	}
);

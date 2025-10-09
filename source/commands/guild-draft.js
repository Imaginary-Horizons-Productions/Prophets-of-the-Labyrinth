const { PermissionFlagsBits, InteractionContextType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, TextDisplayBuilder, ComponentType } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { ICON_CONFIRM, ICON_CANCEL, SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { getPlayer, setPlayer } = require('../orcustrators/playerOrcustrator');
const { timeConversion, extractFromRNTable } = require('../util/mathUtil');
const { getAllArchetypeNames } = require('../archetypes/_archetypeDictionary');
const { PET_NAMES } = require('../pets/_petDictionary');

const customIdPrefix = `${SKIP_INTERACTION_HANDLING}${SAFE_DELIMITER}`;

const mainId = "guild-draft";
//TODONOW write description
module.exports = new CommandWrapper(mainId, "description", PermissionFlagsBits.ViewChannel, false, [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel], 3000,
	(interaction) => {
		const player = getPlayer(interaction.user.id, interaction.guild.id);
		const useFreeRoll = player.nextFreeRoll <= Date.now();
		if (!useFreeRoll && !(player.bonusDrafts > 0)) {
			interaction.reply({ content: `You don't have any bonus drafts available at the moment. Your next free draft is in <t:${Math.floor(player.nextFreeRoll / 1000)}:R>.`, flags: MessageFlags.Ephemeral });
			return;
		}

		// Random Numbers generated from player id and draft count to avoid players seeing results then rerolling before committing draft
		const rnTable = crypto.createHash("sha256").update(`${interaction.user.id}${player.draftCount}`).digest("hex");
		let rnIndex = 0;

		const archetypePool = getAllArchetypeNames();
		const archetypeOptions = [];
		for (let i = 0; i < 2; i++) {
			const randomIndex = extractFromRNTable(rnTable, archetypePool.length, rnIndex);
			rnIndex = (rnIndex + 1) % rnTable.length;
			archetypeOptions.push(archetypePool.splice(randomIndex, 1)[0]);
		}

		const petPool = [...PET_NAMES];
		const petOptions = [];
		for (let i = 0; i < 2; i++) {
			const randomIndex = extractFromRNTable(rnTable, petPool.length, rnIndex);
			rnIndex = (rnIndex + 1) % rnTable.length;
			petOptions.push(petPool.splice(randomIndex, 1)[0]);
		}

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
							new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}${archetypeOptions[0]}`)
								.setStyle(ButtonStyle.Primary)
								.setLabel(archetypeOptions[0]),
							new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}${archetypeOptions[1]}`)
								.setStyle(ButtonStyle.Primary)
								.setLabel(archetypeOptions[1]),
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
				for (const option of archetypeOptions.concat("influence")) {
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
									new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}${petOptions[0]}`)
										.setStyle(ButtonStyle.Primary)
										.setLabel(petOptions[0]),
									new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}${petOptions[1]}`)
										.setStyle(ButtonStyle.Primary)
										.setLabel(petOptions[1]),
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
				for (const option of petOptions.concat("influence")) {
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

				const influencePercent = [selectedArchetype, selectedPet].filter(selection => selection === "influence").length * 25;
				// Uniform: 20, 30, 40, or 50 Guild Influence
				const influenceRoll = 20 + (10 * extractFromRNTable(rnTable, 4, rnIndex));
				rnIndex = (rnIndex + 1) % rnTable.length;
				const totalInfluence = Math.ceil(influenceRoll + (influenceRoll * influencePercent / 100));
				player.guildInfluence += totalInfluence;
				if (selectedArchetype === "influence") {
					selectedArchetype = archetypeOptions[extractFromRNTable(rnTable, 2, rnIndex)];
					rnIndex = (rnIndex + 1) % rnTable.length;
				}
				if (selectedArchetype in player.archetypes) {
					player.archetypes[selectedArchetype].specializationsUnlocked = Math.min(player.archetypes[selectedArchetype].specializationsUnlocked + 1, 4);
				} else {
					player.archetypes[selectedArchetype] = { specializationsUnlocked: 1, highScore: 0 };
				}

				if (selectedPet === "influence") {
					selectedPet = petOptions[extractFromRNTable(rnTable, 2, rnIndex)];
					rnIndex = (rnIndex + 1) % rnTable.length;
				}
				if (selectedPet in player.pets) {
					player.pets[selectedPet] = Math.min(player.pets[selectedPet] + 1, 4);
				} else {
					player.pets[selectedPet] = 1;
				}
				if (!useFreeRoll) {
					player.bonusDrafts--;
				} else {
					player.nextFreeRoll = Date.now() + timeConversion(1, "w", "ms");
				}
				player.draftCount++;
				setPlayer(player);
				containerComponents.push(new TextDisplayBuilder().setContent(`You gained ${totalInfluence} Guild Influence!`))
				collectedInteraction.update({
					components: [{ ...containerPayload, components: containerComponents }]
				});
			})
		})
	}
);

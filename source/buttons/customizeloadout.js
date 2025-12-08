const { ModalBuilder, LabelBuilder, MessageFlags, bold, italic, TextDisplayBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { StringSelectMenuBuilder } = require('@discordjs/builders');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { ICON_PET, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getArchetype } = require('../archetypes/_archetypeDictionary');
const { trimForSelectOptionDescription, listifyEN } = require('../util/textUtil');
const { getEmoji } = require('../util/essenceUtil');
const { artifactNames, getArtifact } = require('../artifacts/_artifactDictionary');
const { extractFromRNTable } = require('../util/mathUtil');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { injectApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { butIgnoreInteractionCollectorErrors } = require('../util/dAPIREsponses');

const mainId = "customizeloadout";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Allow a player to customize their Archetype, Pet, and Starting Artifact from a modal */
	async (interaction, args) => {
		const player = getPlayer(interaction.user.id, interaction.guild.id);
		const adventure = getAdventure(interaction.channelId);
		const archetypeOptions = [];
		for (const archetypeName in player.archetypes) {
			const archetype = getArchetype(archetypeName);
			if (archetype) {
				archetypeOptions.push({
					label: `${archetypeName} ${getEmoji(archetype.essence)}`,
					description: trimForSelectOptionDescription(`Gear: ${listifyEN(archetype.startingGear, false)}`),
					value: archetypeName
				})
			} else {
				console.error(`Attempt to deploy unregistered archtype: ${archetypeName}`);
			}
		}

		const petOptions = [{ label: "No pet", value: "nopet" }];
		for (const petName in player.pets) {
			petOptions.push({
				label: petName,
				description: `Level ${player.pets[petName]}`,
				value: petName
			})
		}

		const startingArtifactOptions = [{ label: "None", description: "Up to 2x Score if no one takes a starting artifact", value: "noartifact" }];

		// Based on Discord snowflake generation, the bits from 22 to 27 refer to the ms out of 64 ms interals a user created their account on
		let start = Number(BigInt(interaction.user.id) >> 22n & 63n);
		const artifactsRolledSoFar = new Set();
		const playerArtifactCollection = Object.values(player.artifacts);
		for (let i = 0; i < 5; i++) {
			const randomIndex = extractFromRNTable(adventure.rnTable, artifactNames.length, start);
			const rolledArtifact = artifactNames[randomIndex];
			if (!artifactsRolledSoFar.has(rolledArtifact)) {
				artifactsRolledSoFar.add(rolledArtifact);
				if (playerArtifactCollection.includes(rolledArtifact)) {
					startingArtifactOptions.push({
						label: rolledArtifact,
						description: trimForSelectOptionDescription(getArtifact(rolledArtifact).dynamicDescription(1)),
						value: rolledArtifact
					})
				}
			}
			start = (start + 1) % adventure.rnTable.length;
		}

		const modal = new ModalBuilder().setCustomId(SKIP_INTERACTION_HANDLING)
			.setTitle("Customize Loadout")
			.addLabelComponents(
				new LabelBuilder().setLabel("Archetype")
					.setDescription("Archetypes differ in what combat information they can predict and what essences they counter.")
					.setStringSelectMenuComponent(
						new StringSelectMenuBuilder()
							.setCustomId(`${SKIP_INTERACTION_HANDLING}archetype`)
							.setPlaceholder("Select an archetype...")
							.addOptions(archetypeOptions)
					),
				new LabelBuilder().setLabel(`${ICON_PET} Bring a Pet`)
					.setDescription("Pets take turns using their supportive moves to aid party.")
					.setStringSelectMenuComponent(new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}pet`)
						.setPlaceholder(`Select a pet...`)
						.addOptions(petOptions)
						.setRequired(false)
					)
			)

		const startingArtifactInputComponentId = `${SKIP_INTERACTION_HANDLING}startingartifact`;
		if (startingArtifactOptions.length > 1) {
			modal.addLabelComponents(
				new LabelBuilder().setLabel("Starting Artifact")
					.setDescription("Each player has a different set of artifacts to select from.")
					.setStringSelectMenuComponent(
						new StringSelectMenuBuilder().setCustomId(startingArtifactInputComponentId)
							.setPlaceholder("Select an artifact...")
							.addOptions(startingArtifactOptions)
							.setRequired(false)
					)
			)
		} else {
			modal.addTextDisplayComponents(
				new TextDisplayBuilder().setContent("### Starting Artifact\nEach player has a different set of artifacts to select from, but you don't have any artifacts to select from in this adventure.")
			)
		}

		await interaction.showModal(modal);
		interaction.awaitModalSubmit({ time: 120000 }).then(modalSubmission => {
			const adventure = getAdventure(interaction.channelId);
			if (adventure?.state !== "config") {
				modalSubmission.reply({ content: "A valid adventure could not be found.", flags: [MessageFlags.Ephemeral] });
				return;
			}
			const delver = adventure.delvers.find(delver => delver.id === modalSubmission.user.id);

			const [archetypeSelection] = modalSubmission.fields.getStringSelectValues(`${SKIP_INTERACTION_HANDLING}archetype`);
			const changedArchetype = delver.archetype !== archetypeSelection;
			delver.archetype = archetypeSelection;

			const [petSelection] = modalSubmission.fields.getStringSelectValues(`${SKIP_INTERACTION_HANDLING}pet`);
			let changedPet = false;
			if (petSelection) {
				if (petSelection !== "nopet") {
					changedPet = delver.pet.type !== petSelection;
					delver.pet = {
						type: petSelection,
						level: getPlayer(interaction.user.id, interaction.guildId).pets[petSelection]
					};
				} else {
					changedPet = delver.pet.type !== "";
					delver.pet = { type: "", level: 0 };
				}
			}

			let changedStartingArtifact = false;
			if (modalSubmission.fields.fields.has(startingArtifactInputComponentId)) {
				const [startingArtifactSelection] = modalSubmission.fields.getStringSelectValues(startingArtifactInputComponentId);
				if (startingArtifactSelection) {
					if (startingArtifactSelection !== "noartifact") {
						changedStartingArtifact = delver.startingArtifact !== startingArtifactSelection;
						delver.startingArtifact = startingArtifactSelection;
					} else {
						changedStartingArtifact = delver.startingArtifact !== "";
						delver.startingArtifact = "";
					}
				}
			}

			setAdventure(adventure);
			if (changedArchetype || changedPet || changedStartingArtifact) {
				let content = `${bold(interaction.user.displayName)} changed their loadout!\n${bold("Archetype")}: ${archetypeSelection}\n${bold("Pet")}: ${delver.pet.type || "None"}\n${bold("Starting Artifact")}: ${delver.startingArtifact || "None"}`;
				if (changedArchetype) {
					const { description, archetypeActionSummary } = getArchetype(archetypeSelection);
					content += `\n\n${italic(`${description} ${injectApplicationEmojiMarkdown(archetypeActionSummary)}`)}`;
				}
				modalSubmission.reply({ content });
			} else {
				modalSubmission.reply({ content: "The provided loadout did not differ from your previous loadout.", flags: MessageFlags.Ephemeral });
			}
		}).catch(butIgnoreInteractionCollectorErrors)
	}
);

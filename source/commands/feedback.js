const { ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { MAX_EMBED_TITLE_LENGTH, testGuildId, feedbackChannelId, SKIP_INTERACTION_HANDLING } = require('../constants');

const mainId = "feedback";
module.exports = new CommandWrapper(mainId, "Provide PotL feedback and get an invite to the test server", PermissionFlagsBits.SendMessages, false, [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel], 3000,
	/** Open the modal associated with the feedback type to prompt more specific information */
	(interaction) => {
		if (!testGuildId || !feedbackChannelId) {
			interaction.reply({ content: "The test server is not yet configured to receive feedback, thanks for your patience.", ephemeral: true });
			return;
		}

		let titlePrefix;
		switch (interaction.options.getString("feedback-type")) {
			case "bug":
				titlePrefix = "Bug Report: ";
				interaction.showModal(new ModalBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setTitle("Bug Report")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("title")
								.setLabel("Title")
								.setMaxLength(MAX_EMBED_TITLE_LENGTH - titlePrefix.length)
								.setStyle(TextInputStyle.Short)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("steps")
								.setLabel("Steps to reproduce")
								.setStyle(TextInputStyle.Paragraph)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("actual")
								.setLabel("What happened")
								.setStyle(TextInputStyle.Short)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("expected")
								.setLabel("What I was expecting to happen")
								.setStyle(TextInputStyle.Short)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("image")
								.setLabel("Screenshot/diagram URL")
								.setRequired(false)
								.setStyle(TextInputStyle.Short)
						)
					)
				);
				interaction.awaitModalSubmit({ filter: (incoming) => incoming.customId === `${SKIP_INTERACTION_HANDLING}${interaction.id}`, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(`${titlePrefix}${modalSubmission.fields.getTextInputValue("title")}`)
						.addFields(
							{ name: "Reporter", value: `<@${modalSubmission.user.id}>` },
							{ name: "Steps to Reproduce", value: modalSubmission.fields.getTextInputValue("steps") },
							{ name: "Actual Behavior", value: modalSubmission.fields.getTextInputValue("actual") },
							{ name: "Expected Behavior", value: modalSubmission.fields.getTextInputValue("expected") }
						);

					if (modalSubmission.user.hexAccentColor) {
						embed.setColor(modalSubmission.user.hexAccentColor);
					}

					const unvalidatedImageURL = modalSubmission.fields.getTextInputValue("image");
					try {
						if (unvalidatedImageURL) {
							new URL(unvalidatedImageURL);
							embed.setImage(unvalidatedImageURL);
						}
					} catch (error) {
						errors.push(error.message);
					}

					modalSubmission.client.guilds.fetch(testGuildId).then(testGuild => {
						return testGuild.channels.fetch(feedbackChannelId);
					}).then(feedbackChannel => {
						feedbackChannel.createInvite({ maxAge: 0 }).then(invite => {
							feedbackChannel.send({ embeds: [embed] });
							modalSubmission.reply({ content: `Your bug report has been recorded${errors.length > 0 ? `, but the following errors were encountered:\n- ${errors.join("\n- ")}` : ""}.You can join the Imaginary Horizons Productions test server to provide additional information here: ${invite.url}`, ephemeral: true })
						})
					})
				}).catch(console.error);
				break;
			case "feature":
				titlePrefix = "Feature Request: ";
				interaction.showModal(new ModalBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setTitle("Feature Request")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("title")
								.setLabel("Title")
								.setMaxLength(MAX_EMBED_TITLE_LENGTH - titlePrefix.length)
								.setStyle(TextInputStyle.Short)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("user")
								.setLabel("For who?")
								.setPlaceholder("As a ___")
								.setStyle(TextInputStyle.Short)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("functionality")
								.setLabel("What kind of feature?")
								.setPlaceholder("I'd like to ___")
								.setStyle(TextInputStyle.Paragraph)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("benefit")
								.setLabel("Why?")
								.setPlaceholder("So that I can ___")
								.setStyle(TextInputStyle.Short)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("image")
								.setLabel("Diagram URL")
								.setRequired(false)
								.setStyle(TextInputStyle.Short)
						)
					)
				);
				interaction.awaitModalSubmit({ filter: (incoming) => incoming.customId === `${SKIP_INTERACTION_HANDLING}${interaction.id}`, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(`${titlePrefix}${modalSubmission.fields.getTextInputValue("title")}`)
						.addFields(
							{ name: "Reporter", value: `<@${modalSubmission.user.id}>` },
							{ name: "User Demographic", value: modalSubmission.fields.getTextInputValue("user") },
							{ name: "Functionality", value: modalSubmission.fields.getTextInputValue("functionality") },
							{ name: "Benefit", value: modalSubmission.fields.getTextInputValue("benefit") }
						);

					if (modalSubmission.user.hexAccentColor) {
						embed.setColor(modalSubmission.user.hexAccentColor);
					}

					const unvalidatedImageURL = modalSubmission.fields.getTextInputValue("image");
					try {
						if (unvalidatedImageURL) {
							new URL(unvalidatedImageURL);
							embed.setImage(unvalidatedImageURL);
						}
					} catch (error) {
						errors.push(error.message);
					}

					modalSubmission.client.guilds.fetch(testGuildId).then(testGuild => {
						return testGuild.channels.fetch(feedbackChannelId);
					}).then(feedbackChannel => {
						feedbackChannel.createInvite({ maxAge: 0 }).then(invite => {
							feedbackChannel.send({ embeds: [embed] });
							modalSubmission.reply({ content: `Your feature request has been recorded${errors.length > 0 ? `, but the following errors were encountered:\n- ${errors.join("\n- ")}` : ""}. You can join the Imaginary Horizons Productions test server to provide additional information here: ${invite.url}`, ephemeral: true })
						})
					})
				}).catch(console.error);
				break;
			case "balance":
				titlePrefix = "Balance Suggestion";
				interaction.showModal(new ModalBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setTitle("Balance Suggestion")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("entity")
								.setLabel("What aspect of the game?")
								.setPlaceholder("Eg gear/monster/item/etc.")
								.setStyle(TextInputStyle.Short)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("direction")
								.setLabel("Is it overpowered or underpowered?")
								.setPlaceholder("Compared to what?")
								.setStyle(TextInputStyle.Short)
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("change")
								.setLabel("What is your suggested change?")
								.setPlaceholder("What problem is this attempting to solve?")
								.setStyle(TextInputStyle.Paragraph)
						)
					)
				);
				interaction.awaitModalSubmit({ filter: (incoming) => incoming.customId === `${SKIP_INTERACTION_HANDLING}${interaction.id}`, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(titlePrefix)
						.addFields(
							{ name: "Game Entity", value: modalSubmission.fields.getTextInputValue("entity") },
							{ name: "Direction", value: modalSubmission.fields.getTextInputValue("direction") },
							{ name: "Suggested Change", value: modalSubmission.fields.getTextInputValue("change") },
							{ name: "Reporter", value: `<@${modalSubmission.user.id}>` }
						);

					if (modalSubmission.user.hexAccentColor) {
						embed.setColor(modalSubmission.user.hexAccentColor);
					}

					modalSubmission.client.guilds.fetch(testGuildId).then(testGuild => {
						return testGuild.channels.fetch(feedbackChannelId);
					}).then(feedbackChannel => {
						feedbackChannel.createInvite({ maxAge: 0 }).then(invite => {
							feedbackChannel.send({ embeds: [embed] });
							modalSubmission.reply({ content: `Your balance suggestion has been recorded${errors.length > 0 ? `, but the following errors were encountered:\n- ${errors.join("\n- ")}` : ""}. You can join the Imaginary Horizons Productions test server to provide additional information here: ${invite.url}`, ephemeral: true })
						})
					})
				}).catch(console.error);
				break;
		}
	}
).setOptions(
	{
		type: "String",
		name: "feedback-type",
		description: "the type of feedback you'd like to provide",
		required: true,
		choices: [
			{ name: "Bug Report", value: "bug" },
			{ name: "Feature Request", value: "feature" },
			{ name: "Balance Suggestion", value: "balance" }
		]
	}
);

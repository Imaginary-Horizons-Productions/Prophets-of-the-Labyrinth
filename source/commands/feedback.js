const { ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { MAX_EMBED_TITLE_LENGTH, testGuildId, feedbackChannelId } = require('../constants');

const mainId = "feedback";
const options = [
	{
		type: "String",
		name: "feedback-type",
		description: "the type of feedback you'd like to provide",
		required: true,
		choices: [{ name: "bug report", value: "bug" }, { name: "feature request", value: "feature" }]
	}
];
const subcommands = [];
module.exports = new CommandWrapper(mainId, "Provide feedback on this bot to the developers", PermissionFlagsBits.SendMessages, false, true, 3000, options, subcommands,
	/** Open the modal associated with the feedback type to prompt more specific information */
	(interaction) => {
		if (!testGuildId || !feedbackChannelId) {
			interaction.reply({ content: "The test server is not yet configured to receive feedback, thanks for your patience.", ephemeral: true });
			return;
		}

		const feedbackType = interaction.options.getString("feedback-type");
		switch (feedbackType) {
			case "bug":
				interaction.showModal(new ModalBuilder().setCustomId(feedbackType)
					.setTitle("Bug Report")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("title")
								.setLabel("Title")
								.setMaxLength(MAX_EMBED_TITLE_LENGTH - 12)
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
				interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === feedbackType, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(`Bug Report: ${modalSubmission.fields.getTextInputValue("title")}`)
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
							modalSubmission.reply({ content: `Your bug report has been recorded${errors.length > 0 ? `, but the following errors were encountered: ${errors.join(", ")}` : ""}.You can join the Imaginary Horizons Productions test server to provide additional information here: ${invite.url}`, ephemeral: true })
						})
					})
				})
				break;
			case "feature":
				interaction.showModal(new ModalBuilder().setCustomId(feedbackType)
					.setTitle("Feature Request")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder().setCustomId("title")
								.setLabel("Title")
								.setMaxLength(MAX_EMBED_TITLE_LENGTH - 17)
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
				interaction.awaitModalSubmit({ filter: (interaction) => interaction.customId === feedbackType, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(`Feature Request: ${modalSubmission.fields.getTextInputValue("title")}`)
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
							modalSubmission.reply({ content: `Your feature request has been recorded${errors.length > 0 ? `, but the following errors were encountered: ${errors.join(", ")}` : ""}. You can join the Imaginary Horizons Productions test server to provide additional information here: ${invite.url}`, ephemeral: true })
						})
					})
				})
				break;
		}
	}
);

const { EmbedBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getColor } = require('../util/elementUtil');
const { updateRoomHeader } = require('../util/embedUtil');
const { getArchetype } = require('../archetypes/_archetypeDictionary');

const mainId = "predict";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Based on type, show the user information on the next battle round in an ephemeral message */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.getChallengeDuration("Blind Avarice") > 0) {
			const cost = adventure.getChallengeIntensity("Blind Avarice");
			if (adventure.gold >= cost) {
				adventure.gold -= cost;
				interaction.channel.messages.fetch(adventure.messageIds.battleRound).then(roomMessage => {
					updateRoomHeader(adventure, roomMessage);
					setAdventure(adventure);
				})
			} else {
				return interaction.reply({ content: "*Blind Avarice* prevents you from predicting until you get more gold.", ephemeral: true });
			}
		}
		const predictFunction = getArchetype(delver.archetype).predict;
		const [infoForNextRound, embed] = predictFunction(new EmbedBuilder().setColor(getColor(adventure.room.element)).setFooter({ text: `Room #${adventure.depth} - Round ${adventure.room.round}` }), adventure);
		let title;
		if (infoForNextRound) {
			title = `Predictions for Round ${adventure.room.round + 1}`;
		} else {
			title = `State of Round ${adventure.room.round}`;
		}
		embed.setTitle(title);
		interaction.reply({ embeds: [embed], ephemeral: true })
			.catch(console.error);
	}
);
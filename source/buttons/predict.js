const { EmbedBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getColor } = require('../util/elementUtil');
const { updateRoomHeader, randomFooterTip } = require('../util/embedUtil');
const { getArchetype } = require('../archetypes/_archetypeDictionary');

const mainId = "predict";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Based on type, show the user information on the next battle round in an ephemeral message */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
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
		interaction.reply({
			embeds: [
				predictFunction(new EmbedBuilder().setAuthor({ name: `Room #${adventure.depth} - Round ${adventure.room.round}` }).setColor(getColor(adventure.room.element)).setFooter(randomFooterTip()), adventure)
			],
			ephemeral: true
		}).catch(console.error);
	}
);

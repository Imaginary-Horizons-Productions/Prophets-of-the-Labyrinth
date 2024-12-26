const { ButtonWrapper } = require('../classes');
const { getArchetype } = require('../archetypes/_archetypeDictionary');
const { buildGearRecord } = require('../gear/_gearDictionary');
const { getAdventure, nextRoom, fetchRecruitMessage, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { bold } = require('discord.js');
const { commandMention } = require('../util/textUtil');

const cursedGearByPurpose = ["Cursed Blade", "Cursed Tome"];

const mainId = "ready";
module.exports = new ButtonWrapper(mainId, 3000,
	/** check if the delver is ready to start the adventure */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You can join this adventure with the button outside the thread.", ephemeral: true });
			return;
		}

		if (!delver.archetype) {
			interaction.reply({ content: "You must pick an archetype before you can ready up.", ephemeral: true });
			return;
		}

		delver.isReady = !delver.isReady;
		if (!adventure.delvers.every(delver => delver.isReady)) {
			setAdventure(adventure);
			interaction.reply({ content: `${bold(interaction.member.displayName)} is ${delver.isReady ? "" : "no longer "}ready!` })
		} else {
			// Clear components from recruitment, start, and deploy messages
			fetchRecruitMessage(interaction.channel, adventure.messageIds.recruit).then(recruitMessage => {
				recruitMessage.edit({ components: [] });
			}).catch(console.error);
			interaction.update({ components: [] }).then(() => {
				interaction.message.delete();
			});

			adventure.delvers.forEach(delver => {
				if (delver.startingArtifact) {
					adventure.gainArtifact(delver.startingArtifact, 1);
				}

				const archetypeTemplate = getArchetype(delver.archetype);
				delver.element = archetypeTemplate.element;
				let cursedIndex;
				if ("Cursed Run" in adventure.challenges) {
					cursedIndex = adventure.generateRandomNumber(archetypeTemplate.startingGear.length, "general");
				}
				delver.gear = archetypeTemplate.startingGear.map((gearName, index) => {
					if (index === cursedIndex) {
						return buildGearRecord(cursedGearByPurpose[index], adventure);
					} else {
						return buildGearRecord(gearName, adventure);
					}
				});
				if (delver.hp > delver.getMaxHP()) {
					delver.hp = delver.getMaxHP();
				}
			})

			interaction.channel.send({ content: `The adventure has begun (and closed to new delvers joining)! You can use ${commandMention("adventure party-stats")} or ${commandMention("adventure inspect-self")} to check adventure status. You can also use ${commandMention("manual")} to look up various information on the game.`, fetchReply: true }).then(message => {
				message.pin();
			});
			adventure.state = "ongoing";
			adventure.lives = adventure.delvers.length + 1;
			const startingGold = 100 + adventure.delvers.length * 50;
			adventure.gold = startingGold;
			adventure.peakGold = startingGold;
			nextRoom(adventure.getChallengeIntensity("Into the Deep End") > 0 ? "Artifact Guardian" : "Battle", interaction.channel);
		}
	}
);

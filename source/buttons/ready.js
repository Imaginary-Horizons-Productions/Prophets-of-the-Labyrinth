const { ButtonWrapper } = require('../classes');
const { getArchetype } = require('../archetypes/_archetypeDictionary');
const { buildGearRecord } = require('../gear/_gearDictionary');
const { getAdventure, nextRoom, fetchRecruitMessage, setAdventure } = require('../orcustrators/adventureOrcustrator');

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
			interaction.reply({ content: `${interaction.member} is ${delver.isReady ? "" : "no longer "}ready!` })
		} else {
			// Clear components from recruitment, start, and deploy messages
			fetchRecruitMessage(interaction.channel, adventure.messageIds.recruit).then(recruitMessage => {
				recruitMessage.edit({ components: [] });
			}).catch(console.error);
			interaction.message.delete();

			adventure.delvers.forEach(delver => {
				if (delver.startingArtifact) {
					adventure.gainArtifact(delver.startingArtifact, 1);
				}

				const archetypeTemplate = getArchetype(delver.archetype);
				delver.element = archetypeTemplate.element;
				delver.gear = archetypeTemplate.startingGear.map(gearName => {
					return buildGearRecord(gearName, "max");
				});
			})

			interaction.reply({ content: `The adventure has begun (and closed to new delvers joining)! You can use the \`/adventure\` commands to check adventure status.`, fetchReply: true }).then(message => {
				message.pin();
				adventure.state = "ongoing";
				adventure.messageIds.utility = message.id;
				nextRoom("Battle", interaction.channel);
			});
		}
	}
);

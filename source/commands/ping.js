const { PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const { CommandWrapper, Adventure } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "ping";
module.exports = new CommandWrapper(mainId, "Remind delvers to input their vote or move", PermissionFlagsBits.SendMessagesInThreads, false, [InteractionContextType.Guild], 3000,
	/** Remind delvers to input their vote or move */
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure || Adventure.endStates.includes(adventure.state)) {
			interaction.reply({ content: "This channel doesn't appear to be an active adventure thread.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const mentions = adventure.delvers.reduce((ids, delver) => ids.add(delver.id), new Set());
		const inCombat = adventure.room.enemies && !adventure.room.enemies.every(enemy => enemy.hp === 0);
		if (inCombat) {
			adventure.room.moves.forEach(move => {
				if (move.userReference.team === "delver") {
					const userId = adventure.delvers[move.userReference.index].id;
					if (mentions.has(userId)) {
						mentions.delete(userId);
					}
				}
			})
		} else {
			Object.values(adventure.roomCandidates).forEach(candidate => {
				candidate.voterIds.forEach(id => {
					if (mentions.has(id)) {
						mentions.delete(id);
					}
				})
			})
		}
		interaction.reply({ content: `Waiting on <@${Array.from(mentions.values()).join(">, <@")}> to ${inCombat ? "ready their move(s)" : "vote"} before moving on.` });
	}
);

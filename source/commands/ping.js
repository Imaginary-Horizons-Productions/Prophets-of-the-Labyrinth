const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper, Adventure } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "ping";
const options = [];
const subcommands = [];
module.exports = new CommandWrapper(mainId, "Remind delvers to input their vote or move", PermissionFlagsBits.SendMessagesInThreads, false, false, 3000, options, subcommands,
	/** Remind delvers to input their vote or move */
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure || Adventure.endStates.includes(adventure.state)) {
			interaction.reply({ content: "This channel doesn't appear to be an active adventure thread.", ephemeral: true });
			return;
		}

		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		const mentions = adventure.delvers.reduce((ids, delver) => ids.add(delver.id), new Set());
		const inCombat = adventure.room.enemies && !adventure.room.enemies.every(enemy => enemy.hp === 0);
		if (inCombat) {
			adventure.room.moves.forEach(move => {
				if (move.userReference.team === "delver") {
					const userId = adventure.delvers[move.userIndex].id;
					if (mentions.has(userId)) {
						mentions.delete(userId);
					}
				}
			})
		} else {
			Object.values(adventure.roomCandidates).forEach(voteArray => {
				voteArray.forEach(id => {
					if (mentions.has(id)) {
						mentions.delete(id);
					}
				})
			})
		}
		interaction.reply({ content: `Waiting on <@${Array.from(mentions.values()).join(">, <@")}> to ${inCombat ? "ready their move(s)" : "vote"} before moving on.` });
	}
);

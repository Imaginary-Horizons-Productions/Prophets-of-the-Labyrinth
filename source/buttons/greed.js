const { MessageFlags } = require('discord.js');
const { ButtonWrapper, Move, CombatantReference } = require('../classes');
const { getAdventure, setAdventure, checkNextRound, endRound } = require('../orcustrators/adventureOrcustrator');

const mainId = "greed";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Set the user's move to clear all debuffs from them with priority */
	(interaction, [round]) => {
		const adventure = getAdventure(interaction.channelId);
		if (adventure?.room.round !== Number(round)) {
			return;
		}
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You don't appear to be participating in this adventure.", flags: [MessageFlags.Ephemeral] });
		}

		const delverIndex = adventure.getCombatantIndex(delver);
		const treasureElementalIndex = adventure.room.enemies.findIndex(enemy => enemy.archetype === "Treasure Elemental");
		const newMove = new Move("Greed", "gear", new CombatantReference(delver.team, delverIndex))
			.setSpeedByCombatant(delver)
			.addTarget(new CombatantReference("enemy", treasureElementalIndex))
			.setPriority(1);

		let overwritten = false;
		for (let i = 0; i < adventure.room.moves.length; i++) {
			const { userReference, type } = adventure.room.moves[i];
			if (type !== "pet" && userReference.team === delver.team && userReference.index === delverIndex) {
				adventure.room.moves.splice(i, 1);
				overwritten = true;
				break;
			}
		}
		adventure.room.moves.push(newMove);

		// Send confirmation text
		interaction.reply(`**${interaction.member.displayName}** ${overwritten ? "switches to get" : "gets"} ready to Greed in the Treasure Realm.`).then(() => {
			setAdventure(adventure);
			if (checkNextRound(adventure)) {
				endRound(adventure, interaction.channel);
			};
		}).catch(console.error);
	}
);

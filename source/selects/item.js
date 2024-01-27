const { SelectWrapper, Move, CombatantReference } = require('../classes');
const { EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getItem } = require('../items/_itemDictionary');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "item";
module.exports = new SelectWrapper(mainId, 3000,
	/** Add a move object to priority moves */
	async (interaction, [round]) => {
		const adventure = getAdventure(interaction.channelId);
		const [itemName] = interaction.values;
		const user = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		const userIndex = adventure.getCombatantIndex(user);
		// Filter out: item uses by self and enemy (only count own team)
		const committedCount = adventure?.room.moves.filter(move => move.name === itemName && move.userReference.team === user.team && move.userReference.index !== userIndex).length;
		if (!(itemName in adventure?.items && adventure?.items[itemName] > committedCount)) {
			interaction.update({ content: `The party doesn't have any more ${itemName}(s) to use.`, embeds: [], components: [] });
			return;
		} else {
			interaction.update(EMPTY_MESSAGE_PAYLOAD);
		}

		if (adventure?.room.round !== Number(round)) {
			return;
		}

		// Add move to round list (overwrite exisiting readied move)
		const newMove = new Move(new CombatantReference(user.team, userIndex), "item", false)
			.setSpeedByCombatant(user)
			.setPriority(1)
			.setName(itemName);

		const item = getItem(itemName);
		item.selectTargets(user, adventure).forEach(target => {
			newMove.addTarget(target);
		})
		let overwritten = false;
		for (let i = 0; i < adventure.room.moves.length; i++) {
			const { userReference } = adventure.room.moves[i];
			if (userReference.team === user.team && userReference.index === userIndex) {
				await adventure.room.moves.splice(i, 1);
				overwritten = true;
				break;
			}
		}
		await adventure.room.moves.push(newMove);

		// Send confirmation text
		interaction.channel.send(`**${interaction.member.displayName}** ${overwritten ? "switches to ready" : "readies"} a(n) **${itemName}**.`).then(() => {
			setAdventure(adventure);
			if (checkNextRound(adventure)) {
				endRound(adventure, interaction.channel);
			}
		}).catch(console.error);
	}
);

const { SelectWrapper, Move, CombatantReference } = require('../classes');
const { SAFE_DELIMITER, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "movetarget";
module.exports = new SelectWrapper(mainId, 3000,
	// Add move object to adventure
	async (interaction, [moveName, round, index]) => {
		const adventure = getAdventure(interaction.channelId);
		const user = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (moveName !== "Punch" && !(user?.gear.some(gear => gear.name === moveName && gear.durability > 0))) {
			// Needed to prevent crashes in case users keep ephemeral messages around and uses one with broken gear
			interaction.update({ content: `You don't have a ${moveName} with durability remaining.`, components: [], embeds: [] });
			return;
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE, embeds: [], components: [] });
		}

		if (adventure?.room.round !== Number(round)) {
			return;
		}

		// Add move to round list (overwrite exisiting readied move)
		const userIndex = adventure.getCombatantIndex(user);
		const [targetTeam, targetIndex] = interaction.values[0].split(SAFE_DELIMITER);
		const newMove = new Move(user, userIndex, "gear", user.crit)
			.setName(moveName)
			.setPriority(getGearProperty(moveName, "priority") ?? 0)
			.addTarget(new CombatantReference(targetTeam, targetIndex));

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
		const target = adventure.getCombatant({ team: targetTeam, index: targetIndex });
		interaction.channel.send(`${interaction.user} ${overwritten ? "switches to ready" : "readies"} **${moveName}** to use on **${target.getName(adventure.room.enemyIdMap)}**.`).then(() => {
			setAdventure(adventure);
			if (checkNextRound(adventure)) {
				endRound(adventure, interaction.channel);
			}
		}).catch(console.error);
	}
);

const fs = require("fs");
const { ThreadChannel, EmbedBuilder, Message } = require("discord.js");

const { Adventure, CombatantReference, Move, Enemy, Delver, Room, Combatant } = require("../classes");

const { SAFE_DELIMITER, MAX_SELECT_OPTIONS, MAX_MESSAGE_ACTION_ROWS } = require("../constants.js");

const { rollArtifact } = require("../artifacts/_artifactDictionary");
const { rollChallenges, getChallenge } = require("../challenges/_challengeDictionary");
const { getEnemy } = require("../enemies/_enemyDictionary");
const { getGearProperty } = require("../gear/_gearDictionary");
const { getItem } = require("../items/_itemDictionary");
const { rollGear, rollItem, getLabyrinthProperty, prerollBoss, rollRoom } = require("../labyrinths/_labyrinthDictionary");
const { getTurnDecrement } = require("../modifiers/_modifierDictionary");

const { clearBlock, removeModifier, addModifier } = require("../util/combatantUtil");
const { getWeaknesses } = require("../util/elementUtil");
const { ensuredPathSave } = require("../util/fileUtil");
const { clearComponents } = require("../util/messageComponentUtil");
const { spawnEnemy } = require("../util/roomUtil");
const { parseExpression } = require("../util/textUtil");

// const { getGuild, setGuild } = require("./guildDAO.js");
// const { resolveMove } = require("./moveDAO.js");
// const { renderRoom, updateRoomHeader } = require("./roomDAO.js");

/** @type {Map<string, Adventure>} */
const adventureDictionary = new Map();

async function loadAdventures() {
	const dirPath = "./saves";
	const fileName = "adventures.json";
	const filePath = `${dirPath}/${fileName}`;
	const requirePath = "./../saves/adventures.json";

	if (fs.existsSync(filePath)) {
		const adventures = require(requirePath);
		let loaded = 0;
		adventures.forEach(adventure => {
			if (!Adventure.endStates.includes(adventure.state)) {
				loaded++;
				// Cast delvers into Delver class
				const castDelvers = [];
				for (let delver of adventure.delvers) {
					castDelvers.push(Object.assign(new Delver(), delver));
				}
				adventure.delvers = castDelvers;

				if (adventure.room) {
					// Cast enemies into Enemy class
					if (adventure.room.enemies) {
						const castEnemies = [];
						for (let enemy of adventure.room.enemies) {
							castEnemies.push(Object.assign(new Enemy(), enemy));
						}
						adventure.room.enemies = castEnemies;
					}

					// Cast moves into Move class
					if (adventure.room.moves) {
						let castMoves = [];
						for (let move of adventure.room.moves) {
							castMoves.push(Object.assign(new Move(), move));
						}
						adventure.room.moves = castMoves;
					}
				}

				// Set adventure
				adventureDictionary.set(adventure.id, Object.assign(new Adventure(adventure.initialSeed, adventure.guildId), adventure));
			}
		})
		return `${loaded} adventures loaded`;
	} else {
		ensuredPathSave(dirPath, fileName, "[]");
		return "adventures regenerated";
	}
}

/** @param {string} id the Discord snowflake of the adventure's thread */
function getAdventure(id) {
	return adventureDictionary.get(id);
}

/** @param {Adventure} adventure */
function setAdventure(adventure) {
	adventureDictionary.set(adventure.id, adventure);
	ensuredPathSave("./saves", "adventures.json", JSON.stringify(Array.from(adventureDictionary.values())));
}

/** @type {Record<number, string[]>} key = weight, value = roomTag[] */
const roomTypesByRarity = {
	1: ["Treasure"],
	3: ["Artifact Guardian"],
	5: ["Forge", "Rest Site", "Merchant"],
	10: ["Battle", "Event"]
};

/** @param {Adventure} adventure */
function rollGearTier(adventure) {
	const cloverCount = adventure.getArtifactCount("Negative-One Leaf Clover");
	const baseUpgradeChance = 1 / 8;
	const cloverUpgradeChance = cloverCount > 0 ? 1 - 0.80 ** cloverCount : 1;
	const max = 144;
	const threshold = max * baseUpgradeChance / cloverUpgradeChance;
	adventure.updateArtifactStat("Negative-One Leaf Clover", "Expected Extra Rare Gear", (threshold / max) - baseUpgradeChance);
	return adventure.generateRandomNumber(max, "general") < threshold ? "Rare" : "Common";
}

/** Set up the upcoming room: roll options for rooms after, update adventure's room meta data object for current room, and generate room's resources
 * @param {"Artifact Guardian" | "Treasure" | "Forge" | "Rest Site" | "Merchant" | "Battle" | "Event" | "Empty"} roomType
 * @param {ThreadChannel} thread
 */
function nextRoom(roomType, thread) {
	const adventure = getAdventure(thread.id);

	adventure.delvers.forEach(delver => {
		delver.modifiers = {};
		delver.gear.forEach(gear => {
			if (gear.name.startsWith("Organic")) {
				gear.durability++;
			}
		})
	})

	const piggyBankCount = adventure.getArtifactCount("Piggy Bank");
	const interest = adventure.gold * piggyBankCount * 0.05;
	if (piggyBankCount > 0) {
		adventure.gainGold(interest);
		adventure.updateArtifactStat("Piggy Bank", "Interest Accrued", interest);
	}

	// Roll options for next room type
	if (!getLabyrinthProperty(adventure.labyrinth, "bossRoomDepths").includes(adventure.depth + 1)) {
		const mapCount = adventure.getArtifactCount("Enchanted Map");
		if (mapCount) {
			adventure.updateArtifactStat("Enchanted Map", "Extra Rooms Rolled", mapCount);
		}
		const numCandidates = 2 + mapCount;
		for (let i = 0; i < numCandidates; i++) {
			const roomWeights = Object.keys(roomTypesByRarity);
			const totalWeight = roomWeights.reduce((total, weight) => total + parseInt(weight), 0);
			let rn = adventure.generateRandomNumber(totalWeight, 'general');
			let tagPool = [];
			for (const weight of roomWeights.sort((a, b) => a - b)) {
				if (rn < weight) {
					tagPool = roomTypesByRarity[weight];
					break;
				} else {
					rn -= weight;
				}
			}
			const candidateTag = `${tagPool[adventure.generateRandomNumber(tagPool.length, "general")]}${SAFE_DELIMITER}${adventure.depth}`;
			if (!(candidateTag in adventure.roomCandidates)) {
				adventure.roomCandidates[candidateTag] = [];
				if (Object.keys(adventure.roomCandidates).length === MAX_MESSAGE_ACTION_ROWS) {
					break;
				}
			}
		}
	} else {
		adventure.roomCandidates[`Final Battle${SAFE_DELIMITER}${adventure.depth}`] = [];
	}

	// Generate current room
	const roomTemplate = rollRoom(roomType, adventure);
	adventure.room = new Room(roomTemplate.title, roomTemplate.element, roomTemplate.enemyList);
	if (adventure.room.element === "@{adventure}") {
		adventure.room.element = adventure.element;
	} else if (adventure.room.element === "@{adventureWeakness}") {
		const weaknessPool = getWeaknesses(adventure.element);
		adventure.room.element = weaknessPool[adventure.generateRandomNumber(weaknessPool.length, "general")];
	}

	// Initialize Resources
	for (const { resourceType, count: unparsedCount, tier: unparsedTier, visibility, cost: unparsedCost, uiGroup } of roomTemplate.resourceList) {
		const count = Math.ceil(parseExpression(unparsedCount, adventure.delvers.length));
		switch (resourceType) {
			case "challenge":
				rollChallenges(Math.min(MAX_SELECT_OPTIONS, count), adventure).forEach(challengeName => {
					adventure.addResource(challengeName, resourceType, visibility, 1);
				})
				break;
			case "gear":
				let tier = unparsedTier;
				for (let i = 0; i < Math.min(MAX_SELECT_OPTIONS, count); i++) {
					if (unparsedTier === "?") {
						tier = rollGearTier(adventure);
					}
					const gearName = rollGear(tier, adventure);
					adventure.addResource(gearName, resourceType, visibility, 1, uiGroup, Math.ceil(parseExpression(unparsedCost, getGearProperty(gearName, "cost", resourceType))));
				}
				break;
			case "artifact":
				const artifact = rollArtifact(adventure);
				adventure.addResource(artifact, resourceType, visibility, count, uiGroup);
				break;
			case "item":
				const item = rollItem(adventure);
				adventure.addResource(item, resourceType, visibility, count, uiGroup, Math.ceil(parseExpression(unparsedCost, getItem(item).cost)));
				break;
			case "gold":
				// Randomize loot gold
				let goldCount = count;
				if (visibility !== "internal") {
					goldCount = Math.ceil(count * (90 + adventure.generateRandomNumber(21, "general")) / 100);
				}
				adventure.addResource(resourceType, resourceType, visibility, goldCount, uiGroup);
				break;
			default:
				adventure.addResource(resourceType, resourceType, visibility, count, uiGroup);
		}
	}

	if (adventure.room.hasEnemies) {
		if (roomType === "Artifact Guardian") {
			adventure.scouting.artifactGuardiansEncountered++;
			while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians) {
				prerollBoss("Artifact Guardian", adventure);
			}
			adventure.scouting.artifactGuardians = Math.max(adventure.scouting.artifactGuardians - 1, 0);
		}

		for (const enemyName in roomTemplate.enemyList) {
			for (let i = 0; i < Math.ceil(parseExpression(roomTemplate.enemyList[enemyName], adventure.delvers.length)); i++) {
				spawnEnemy(adventure, getEnemy(enemyName));
			}
		}
		newRound(adventure, thread);
		setAdventure(adventure);
	} else {
		thread.send(renderRoom(adventure, thread)).then(message => {
			adventure.messageIds.room = message.id;
			setAdventure(adventure);
		});
	}
}

/**
 * @param {"Artifact Guardian" | "Treasure" | "Forge" | "Rest Site" | "Merchant" | "Battle" | "Event" | "Empty"} roomType
 * @param {ThreadChannel} thread
 */
function endRoom(roomType, thread) {
	const adventure = getAdventure(thread.id);
	adventure.depth++;
	adventure.room = {};
	// reset roomCandidates early enough (before being deferred to the callback stack) to prevent routevote racecondition
	adventure.roomCandidates = {};

	for (const challengeName in adventure.challenges) {
		if (adventure.challenges[challengeName].duration) {
			adventure.challenges[challengeName].duration--;
			if (adventure.challenges[challengeName].duration < 1) {
				getChallenge(challengeName).complete(adventure, thread);
			}
		}
	}
	nextRoom(roomType, thread);
}

/** Cleans up previous combat round, generates events for current round, and sends room message
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {string} lastRoundText
 */
function newRound(adventure, thread, lastRoundText) {
	// Increment round and clear last round's components
	adventure.room.round++;

	// Logistics for Next Round
	const teams = {
		enemy: adventure.room.enemies,
		delver: adventure.delvers
	};
	for (const teamName in teams) {
		teams[teamName].forEach(
			/**
			 * @param {Combatant} combatant
			 * @param {number} i
			 */
			(combatant, i) => {
				// Clear Excess Block if doesn't have vigilance
				if (combatant.getModifierStacks("Vigilance") === 0) {
					clearBlock(combatant);
				}

				// Roll Round Speed
				const percentBonus = (adventure.generateRandomNumber(21, "battle") - 10) / 100;
				combatant.roundSpeed = Math.floor(combatant.speed * percentBonus);

				// Roll Critical Hit
				const baseCritChance = (1 + (combatant.critBonus / 100)) * (1 / 4);
				const max = 144;
				let threshold = max * baseCritChance;
				const featherCount = adventure.getArtifactCount("Hawk Tailfeather");
				if (featherCount > 0 && combatant.team === "delver") {
					const featherCritChance = 1 - 0.85 ** featherCount;
					threshold /= featherCritChance;
					adventure.updateArtifactStat("Hawk Tailfeather", "Expected Extra Critical Hits", (threshold / max) - baseCritChance);
				}
				const critRoll = adventure.generateRandomNumber(max, "battle");
				combatant.crit = critRoll < threshold;

				// Roll Enemy Moves and Generate Dummy Moves
				const move = new Move(new CombatantReference(teamName, i), "action", combatant.crit, combatant.getTotalSpeed())
				if (combatant.getModifierStacks("Stun") > 0) {
					// Dummy move for Stunned combatants
					move.setName("Stun");
				} else {
					if (teamName === "enemy") {
						if (combatant.archetype !== "@{clone}") {
							const enemyTemplate = getEnemy(combatant.archetype);
							let actionName = combatant.nextAction;
							if (actionName === "random") {
								const actionPool = Object.keys(enemyTemplate.actions);
								actionName = actionPool[adventure.generateRandomNumber(actionPool.length, "battle")];
							}
							if (actionName === "a random protocol") {
								const actionPool = Object.keys(enemyTemplate.actions).filter(actionName => actionName.includes("Protocol"));
								actionName = actionPool[adventure.generateRandomNumber(actionPool.length, "battle")];
							}
							move.setName(actionName);
							move.setPriority(enemyTemplate.actions[move.name].priority)
							enemyTemplate.actions[actionName].selector(adventure, combatant).forEach(({ team, index }) => {
								move.addTarget(new CombatantReference(team, index));
							})
							combatant.nextAction = enemyTemplate.actions[actionName].next(actionName);
						} else {
							move.setName("@{clone}");
						}
					}
				}
				if (move.name) {
					adventure.room.moves.push(move);
				}

				// Decrement Modifiers
				for (const modifier in combatant.modifiers) {
					removeModifier(combatant, { name: modifier, stacks: getTurnDecrement(modifier), force: true })
				}

				// Persisting Round Effects
				const floatingMistStacks = combatant.getModifierStacks("Floating Mist Stance");
				if (floatingMistStacks > 0) {
					addModifier(combatant, { name: "Evade", stacks: floatingMistStacks * 2 });
				}
			})
	}

	thread.send(renderRoom(adventure, thread, lastRoundText)).then(message => {
		if (!checkNextRound(adventure)) {
			updateRoomHeader(adventure, message);
			adventure.messageIds.battleRound = message.id;
		} else {
			clearComponents(message.id, thread.messages);
			endRound(adventure, thread);
		}
		setAdventure(adventure);
	});
}

/** Generate reactive moves, randomize speed ties, then resolve moves
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 */
async function endRound(adventure, thread) {
	clearComponents(adventure.messageIds.battleRound, thread.messages);

	// Generate Reactive Moves by Enemies
	adventure.room.enemies.forEach((enemy, enemyIndex) => {
		if (enemy.archetype === "@{clone}") {
			const counterpartMove = adventure.room.moves.find(move => move.userReference.team === "delver" && move.userReference.index == enemyIndex);
			for (const currentMove of adventure.room.moves) {
				if (currentMove.team === "enemy" && currentMove.userReference.index === enemyIndex) {
					currentMove.type = counterpartMove.type;
					currentMove.setName(counterpartMove.name);
					currentMove.targets.forEach(target => {
						if (target.team === "enemy") {
							target.team = "delver";
						} else {
							target.team = "enemy";
						}
					})
				}
				break;
			}
		}
	});


	// Randomize speed ties
	const randomOrderBag = Array(adventure.room.moves.length).fill().map((_, idx) => idx) // ensure that unique values are available for each move
	adventure.room.moves.forEach(move => {
		const rIdx = adventure.generateRandomNumber(randomOrderBag.length, "battle");
		move.randomOrder = randomOrderBag.splice(rIdx, 1)[0]; // pull a remaining randomOrder out of the bag and assign it to a move
	})
	adventure.room.moves.sort(Move.compareMoveSpeed)

	// Resolve moves
	let lastRoundText = "";
	for (const move of adventure.room.moves) {
		lastRoundText += await resolveMove(move, adventure);
		// Check for end of combat
		if (adventure.lives <= 0) {
			adventure.room.round++;
			return thread.send(completeAdventure(adventure, thread, "defeat", lastRoundText));
		}

		if (adventure.room.enemies.every(enemy => enemy.hp === 0)) {
			if (adventure.depth === getLabyrinthProperty(adventure.labyrinth, "maxDepth")) {
				return thread.send(completeAdventure(adventure, thread, "success", lastRoundText));
			}

			// Gear drops
			const gearThreshold = 1;
			const gearMax = 16;
			if (adventure.generateRandomNumber(gearMax, "general") < gearThreshold) {
				const tier = rollGearTier(adventure);
				const droppedGear = rollGear(tier, adventure);
				adventure.addResource(droppedGear, "gear", "loot", 1);
			}

			// Item drops
			const itemThreshold = 1;
			const itemMax = 8;
			if (adventure.generateRandomNumber(itemMax, "general") < itemThreshold) {
				adventure.addResource(rollItem(adventure), "item", "loot", 1);
			}

			return thread.send(renderRoom(adventure, thread, lastRoundText));
		}
	}
	adventure.room.moves = [];
	newRound(adventure, thread, lastRoundText);
}

/** The round ends when all combatants have readied all their moves
 * @param {Adventure} adventure
 */
function checkNextRound({ room, delvers }) {
	const readiedMoves = room.moves.length;
	const movesThisRound = room.enemies.length + delvers.length;
	return readiedMoves === movesThisRound;
}

/** The recruit message solicits new delvers to join (until the adventure starts) and shows the state of the adventure publically thereafter
 * @param {ThreadChannel} thread the adventure's thread
 * @param {string} messageId usually stored in `adventure.messageIds.recruit`
 * @returns {Promise<Message>}
 */
async function fetchRecruitMessage(thread, messageId) {
	const channel = await thread.guild.channels.fetch(thread.parentId);
	return channel.messages.fetch(messageId);
}

/**
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {"success" | "defeat" | "giveup"} endState
 * @param {string?} descriptionOverride
 */
function completeAdventure(adventure, thread, endState, descriptionOverride) {
	const { messages: messageManager } = thread;
	fetchRecruitMessage(thread, adventure.messageIds.recruit).then(recruitMessage => {
		const [{ data: recruitEmbed }] = recruitMessage.embeds;
		recruitMessage.edit({
			embeds: [
				new EmbedBuilder(recruitEmbed)
					.setTitle(recruitEmbed.title + ": COMPLETE!")
					.setThumbnail("https://cdn.discordapp.com/attachments/545684759276421120/734092918369026108/completion.png")
					.addFields({ name: "Seed", value: adventure.initialSeed })
			], components: []
		});
	})
	clearComponents(adventure.messageIds.battleRound, messageManager);
	clearComponents(adventure.messageIds.room, messageManager);
	[adventure.messageIds.utility].forEach(id => {
		if (id) {
			messageManager.delete(id).catch(console.error);
		}
	})

	adventure.state = endState;
	setAdventure(adventure);
	const guildProfile = getGuild(thread.guild.id);
	adventure.delvers.forEach(delver => guildProfile.adventuring.delete(delver.id));
	setGuild(guildProfile);
	return renderRoom(adventure, thread, descriptionOverride);
}

module.exports = {
	loadAdventures,
	getAdventure,
	setAdventure,
	nextRoom,
	endRoom,
	newRound,
	endRound,
	checkNextRound,
	fetchRecruitMessage,
	completeAdventure
};
const fs = require("fs");
const { ThreadChannel, Message, EmbedBuilder, bold, italic } = require("discord.js");

const { Adventure, CombatantReference, Move, Enemy, Delver, Room, Combatant } = require("../classes");

const { SAFE_DELIMITER, MAX_MESSAGE_ACTION_ROWS, RN_TABLE_BASE } = require("../constants.js");

const { getChallenge } = require("../challenges/_challengeDictionary");
const { getEnemy } = require("../enemies/_enemyDictionary");
const { getGearProperty, gearExists } = require("../gear/_gearDictionary");
const { getItem } = require("../items/_itemDictionary");
const { rollGear, rollItem, getLabyrinthProperty, prerollBoss, rollRoom } = require("../labyrinths/_labyrinthDictionary");
const { getModifierCategory, getRoundDecrement, getMoveDecrement } = require("../modifiers/_modifierDictionary");
const { removeModifier, dealModifierDamage, gainHealth, changeStagger, addProtection } = require("../util/combatantUtil");
const { renderRoom, generateRecruitEmbed, roomHeaderString } = require("../util/embedUtil");
const { essenceList, getCounteredEssences, getEmoji } = require("../util/essenceUtil.js");
const { ensuredPathSave } = require("../util/fileUtil");
const { anyDieSucceeds, parseExpression } = require("../util/mathUtil.js");
const { clearComponents } = require("../util/messageComponentUtil");
const { spawnEnemy, rollGearTier } = require("../util/roomUtil");
const { listifyEN } = require("../util/textUtil");
const { levelUp } = require("../util/delverUtil.js");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { rollableHerbs } = require("../shared/herbs");
const { rollablePotions } = require("../shared/potions");
const { getPetMove, generatePetRNs } = require("../pets/_petDictionary.js");
const { getArchetypeActionName } = require("../archetypes/_archetypeDictionary.js");

/** @type {Map<string, Adventure>} */
const adventureDictionary = new Map();

async function loadAdventures() {
	const dirPath = "./saves";
	const fileName = "adventures.json";
	const filePath = `${dirPath}/${fileName}`;
	const requirePath = "../../saves/adventures.json";

	if (fs.existsSync(filePath)) {
		const adventures = require(requirePath);
		let loaded = 0;
		adventures.forEach(adventure => {
			if (!Adventure.endStates.includes(adventure.state)) {
				loaded++;
				// Cast delvers into Delver class
				const castDelvers = [];
				for (let delver of adventure.delvers) {
					const castDelver = Object.assign(new Delver(), delver);
					castDelver.gear.forEach(gear => { if (gear.charges === null) { gear.charges = Infinity; } });
					castDelvers.push(castDelver);
				}
				adventure.delvers = castDelvers;

				if (adventure.room) {
					adventure.room = Object.assign(new Room(), adventure.room);

					// Cast enemies into Enemy class
					if (adventure.room.enemies) {
						const castEnemies = [];
						for (let enemy of adventure.room.enemies) {
							castEnemies.push(Object.assign(new Enemy(enemy.name), enemy));
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
	5: ["Workshop", "Rest Site", "Merchant", "Artifact Guardian", "Library"],
	10: ["Battle", "Event"]
};

/** Set up the upcoming room: roll options for rooms after, update adventure's room meta data object for current room, and generate room's resources
 * @param {"Artifact Guardian" | "Treasure" | "Workshop" | "Rest Site" | "Merchant" | "Battle" | "Event" | "Empty"} roomType
 * @param {ThreadChannel} thread
 */
function nextRoom(roomType, thread) {
	const adventure = getAdventure(thread.id);

	adventure.delvers.forEach(delver => {
		delver.protection = 0;
		if (adventure.challenges["Training Weights"]?.duration > 0) {
			const stacks = adventure.challenges["Training Weights"].intensity;
			delver.modifiers = {
				"Torpidity": stacks,
				"Exposure": stacks
			};
		} else {
			delver.modifiers = {};
		}
		delver.stagger = 0;
		delver.isStunned = false;
		delver.gear.forEach(gear => { gear.cooldown = 0; });
	})

	const piggyBankCount = adventure.getArtifactCount("Piggy Bank");
	const interest = Math.floor(adventure.gold * piggyBankCount * 0.05);
	if (piggyBankCount > 0) {
		adventure.gainGold(interest);
		adventure.updateArtifactStat("Piggy Bank", "Interest Accrued", interest);
	}

	// Roll options for next room type
	let floorStart;
	let floorEnd;
	const bossDepths = getLabyrinthProperty(adventure.labyrinth, "bossRoomDepths");
	for (let i = 0; i < bossDepths.length; i++) {
		if (bossDepths[i] > adventure.depth) {
			floorStart = bossDepths[i - 1] ?? 0;
			floorEnd = bossDepths[i];
		}
	}
	const nextDepth = adventure.depth + 1;
	if (Math.floor((floorStart + floorEnd) / 2) === nextDepth) {
		// Guaranteed Guildstop at midpoint of floors
		adventure.roomCandidates[`Guildstop${SAFE_DELIMITER}${adventure.depth}`] = { voterIds: [], isHidden: false };
	} else if (floorEnd - 1 === nextDepth) {
		// Guaranteed Rest Site before Final Battle
		adventure.roomCandidates[`Rest Site${SAFE_DELIMITER}${adventure.depth}`] = { voterIds: [], isHidden: false };
	} else if (floorEnd === nextDepth) {
		// Final Battle
		adventure.roomCandidates[`Final Battle${SAFE_DELIMITER}${adventure.depth}`] = { voterIds: [], isHidden: false };
	} else {
		// Other Room
		const mapCount = adventure.getArtifactCount("Enchanted Map");
		if (mapCount) {
			adventure.updateArtifactStat("Enchanted Map", "Extra Rooms Rolled", mapCount);
		}
		const numCandidates = 2 + mapCount;
		const max = RN_TABLE_BASE ** 2;
		const rushingChance = adventure.getChallengeIntensity("Rushing") / 100;
		const roomWeights = Object.keys(roomTypesByRarity);
		const totalWeight = roomWeights.reduce((total, weight) => total + parseInt(weight), 0);
		for (let i = 0; i < numCandidates; i++) {
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
				adventure.roomCandidates[candidateTag] = { voterIds: [], isHidden: adventure.generateRandomNumber(max, "general") < max * rushingChance };
				if (Object.keys(adventure.roomCandidates).length === MAX_MESSAGE_ACTION_ROWS) {
					break;
				}
			}
		}
	}

	// Generate current room
	const roomTemplate = rollRoom(roomType, adventure);
	adventure.room = new Room(roomTemplate.title, roomTemplate.essence, roomTemplate.enemyList);
	const labyrinthSpecificResources = roomTemplate.init(adventure);
	for (const { type, count, visibility, forSale, uiGroup } of labyrinthSpecificResources) {
		switch (type) {
			case "Gear": {
				const gear = rollGear(rollGearTier(adventure), adventure);
				adventure.room.addResource(gear, type, visibility, count, uiGroup, forSale ? getGearProperty(gear, "cost") : 0);
				break;
			}
			case "Item": {
				const item = rollItem(adventure);
				adventure.room.addResource(item, type, visibility, count, uiGroup, forSale ? getItem(item).cost : 0);
				break;
			}
		}
	}
	if (adventure.room.essence === "@{adventure}") {
		adventure.room.essence = adventure.essence;
	} else if (adventure.room.essence === "@{adventureCounter}") {
		const essencePool = [];
		for (const essence of essenceList(["Unaligned", adventure.essence])) {
			if (getCounteredEssences(essence).includes(adventure.essence)) {
				essencePool.push(essence);
			}
		}
		if (essencePool.length > 0) {
			adventure.room.essence = essencePool[adventure.generateRandomNumber(essencePool.length, "general")];
		} else {
			adventure.room.essence = "Unaligned";
		}
	}

	if (roomTemplate.enemyList.length > 0) {
		if (roomType === "Artifact Guardian") {
			adventure.scouting.artifactGuardiansEncountered++;
			while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians) {
				prerollBoss("Artifact Guardian", adventure);
			}
			adventure.scouting.artifactGuardians = Math.max(adventure.scouting.artifactGuardians - 1, 0);
		}
		if (roomType === "Final Battle") {
			adventure.scouting.bossesEncountered++;
			while (adventure.bosses.length <= adventure.scouting.bossesEncountered + adventure.scouting.bosses) {
				prerollBoss("Final Battle", adventure);
			}
			adventure.scouting.bosses = Math.max(adventure.scouting.bosses - 1, 0);
		}

		for (const [enemyName, countExpression] of roomTemplate.enemyList) {
			for (let i = 0; i < Math.ceil(parseExpression(countExpression, adventure.delvers.length)); i++) {
				spawnEnemy(getEnemy(enemyName), adventure);
			}
		}
		generatePetRNs(adventure);
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
 * @param {"Artifact Guardian" | "Treasure" | "Workshop" | "Rest Site" | "Merchant" | "Battle" | "Event" | "Empty"} roomType
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

const rnsConcerningTargets = new Set(["vulnerabilities", "buffs", "debuffs", "Medicine"]);

/**
 * Cache the random result of a move, onto the roundRns of a combatant
 * @param {Adventure} adventure
 * @param {Combatant} user
 * @param {"foes" | "allies" | "essences" | string} moveName
 * @param {Record<string, number|Record<string,number>>} config
 */
function cacheRoundRn(adventure, user, moveName, config) {
	for (const key in config) {
		const roundRnKeyname = `${moveName}${SAFE_DELIMITER}${key}`;
		if (!(roundRnKeyname in user.roundRns)) {
			let rnCount = config[key];
			switch (key) {
				case "foes":
					if (user.team === "delver") {
						rnCount += adventure.getArtifactCount("Loaded Dice");
						const livingEnemyIndices = [];
						adventure.room.enemies.forEach((enemy, i) => {
							if (enemy.hp > 0) {
								livingEnemyIndices.push(i);
							}
						})
						user.roundRns[roundRnKeyname] = [];
						for (let i = 0; i < rnCount; i++) {
							user.roundRns[roundRnKeyname].push(livingEnemyIndices[adventure.generateRandomNumber(livingEnemyIndices.length, "battle")]);
						}
					} else {
						user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(adventure.delvers.length, "battle"))
					}
					break;
				case "allies":
					if (user.team === "delver") {
						rnCount += adventure.getArtifactCount("Loaded Dice");
						user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(adventure.delvers.length, "battle"))
					} else {
						const livingEnemyIndices = [];
						adventure.room.enemies.forEach((enemy, i) => {
							if (enemy.hp > 0) {
								livingEnemyIndices.push(i);
							}
						})
						user.roundRns[roundRnKeyname] = [];
						for (let i = 0; i < rnCount; i++) {
							user.roundRns[roundRnKeyname].push(livingEnemyIndices[adventure.generateRandomNumber(livingEnemyIndices.length, "battle")]);
						}
					}
					break;
				case "essenceShift":
				case "essencesNoUnaligned":
					user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(6, "battle"));
					break;
				case "vulnerabilities":
					user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(6, "battle"))
					break;
				// assuming 256 (2 rn table digits) is a large enough bound on de/buffs
				case "buffs":
				case "debuffs":
					user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(256, "battle"))
					break;
				case "progress":
					user.roundRns[roundRnKeyname] = [config.progress.base + user.crit ? config.progress.crit : 0 + adventure.generateRandomNumber(config.progress.random + 1, "battle")]
					break;
				case "herbs":
					user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(rollableHerbs.length, "battle"))
					break;
				case "potions":
					user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(rollablePotions.length, "battle"))
					break;
				case "Mug or Mark":
					user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(4, "battle"));
					break;
				case "Deck of Cards":
					user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(8, "battle"));
					break;
				case "Medicine":
					user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(256, "battle"))
					break;
				default: {
					const keyAsInt = parseInt(key);
					if (!isNaN(keyAsInt)) {
						user.roundRns[roundRnKeyname] = Array(rnCount).fill(null).map(() => adventure.generateRandomNumber(keyAsInt, "battle"))
					}
					else {
						console.error(`Invalid config key ${key} for cacheRoundRn`);
						user.roundRns[roundRnKeyname] = [];
					}
				}
			}
		}
	}
	return user.roundRns;
}

/**
 * Given a target (or lackthereof) for a random-concerned-move and user, return a predicted outcome.
 * @param {Adventure} adventure
 * @param {Combatant} user
 * @param {Combatant} target
 * @param {string} moveName
 * @param {"foes" | "allies" | "essences" | string} key
 */
function predictRoundRnTargeted(adventure, user, target, moveName, key) {
	const roundRnKeyname = `${moveName}${SAFE_DELIMITER}${key}`;
	let targetModifiers = null;
	switch (key) {
		case "foes": {
			const enemyPool = user.team !== "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			return `${user.name}'s ${moveName} will affect ${listifyEN(user.roundRns[roundRnKeyname].map(rn => enemyPool[rn % enemyPool.length].name), false)}`;
		}
		case "allies": {
			const allyPool = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			return `${user.name}'s ${moveName} will affect ${listifyEN(user.roundRns[roundRnKeyname].map(rn => allyPool[rn % allyPool.length].name), false)}`;
		}
		case "essenceShift": {
			const essences = essenceList(["Unaligned", user.essence]);
			return `${user.name}'s ${moveName} attunes ${user.roundRns[roundRnKeyname].map(rn => getEmoji(essences[rn % essences.length])).join("")} on ${target.name}`;
		}
		case "essencesNoUnaligned": {
			const essencesNoUnaligned = essenceList(["Unaligned"])
			return `${user.name}'s ${moveName} attunes ${user.roundRns[roundRnKeyname].map(rn => getEmoji(essencesNoUnaligned[rn % essencesNoUnaligned.length])).join("")} on ${target.name}`;
		}
		case "vulnerabilities": {
			const essencePool = essenceList(["Unaligned"]);
			return `${user.name}'s ${moveName} will inflict ${user.roundRns[roundRnKeyname].map(rn => getApplicationEmojiMarkdown(`${essencePool[rn % essencePool.length]} Vulnerability`)).join("")} on ${target.name}`;
		}
		case "buffs":
			targetModifiers = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		case "debuffs": {
			targetModifiers ??= Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
			let pendingRemoves = user.roundRns[roundRnKeyname].length;
			if (targetModifiers.length > pendingRemoves) {
				return predictRemovedModifiers(target, user, moveName, roundRnKeyname, targetModifiers);
			}
			break;
		}
		case "progress": {
			let pendingProgress = user.getModifierStacks("Progress") + user.roundRns[roundRnKeyname][0];
			return `The Elkemist ${pendingProgress > 100 ? "will" : "won't"} reach an epiphany this round.`;
		}
		case "herbs":
			return `${user.name}'s ${moveName} produces a ${rollableHerbs[user.roundRns[roundRnKeyname][0] % rollableHerbs.length]}`;
		case "potions":
			return `${user.name}'s ${moveName} produces a ${rollablePotions[user.roundRns[roundRnKeyname][0] % rollablePotions.length]}`;
		case "Mug or Mark":
			return `${user.name} will apply ${user.roundRns[roundRnKeyname][0] + 2} stacks of The Mark if there isn't a mark yet.`;
		case "Deck of Cards":
			return `${user.name}'s ${moveName} will inflict ${user.roundRns[roundRnKeyname][0] + 2} ${getApplicationEmojiMarkdown("Misfortune")}.`;
		case "Medicine": {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
			if (targetDebuffs.length > 1) {
				const firstDebuff = getApplicationEmojiMarkdown(targetDebuffs.splice(user.roundRns[roundRnKeyname][0] % targetDebuffs.length, 1)[0]);
				const secondDebuff = getApplicationEmojiMarkdown(targetDebuffs[user.roundRns[roundRnKeyname][1] % targetDebuffs.length]);
				return `${user.name}'s ${moveName} will cure ${firstDebuff} (and ${secondDebuff} on 💥) on ${target.name}.`;
			} else if (targetDebuffs.length === 1) {
				return `${user.name}'s ${moveName} will cure ${getApplicationEmojiMarkdown(targetDebuffs[0])} on ${target.name}.`;
			}
			break;
		}
		default:
			console.error(`Invalid config key ${key} for predictRoundRnTargeted`);
	}
	return null;
}

/**
 * Precalculate outcomes of current enemy moves and possible delver move-choices (against possible targets), and return array of possible predict-texts
 * @param {Adventure} adventure
 */
function predictRoundRnOutcomes(adventure) {
	let outcomes = [];
	// tabulate outcomes
	// enemy moves
	for (const move of adventure.room.moves) {
		const user = move.userReference;
		if (user.team === "enemy") {
			const combatant = adventure.getCombatant(user);
			const enemy = getEnemy(combatant.archetype);
			const moveReference = enemy.actions[move.name];
			if (moveReference?.rnConfig) {
				for (const key in moveReference.rnConfig) {
					if (move.targets.length > 0) {
						const targetCombatants = move.targets.map(moveTarget => adventure.getCombatant(moveTarget));
						if (move.name === "Bubble") {
							let totalBuffsRemoved = targetCombatants.reduce((removedCount, combatant) => removedCount + Math.max(0, Object.keys(combatant.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff").length - combatant.getModifierStacks("Retain")), 0);
							let pendingProgress = combatant.getModifierStacks("Progress") + (combatant.crit ? 10 : 0) + combatant.roundRns[`Bubble${SAFE_DELIMITER}progress`][2] + totalBuffsRemoved * 5;
							outcomes.push(`The Elkemist ${pendingProgress > 100 ? "will" : "won't"} reach an epiphany this round.`);
						}
						else {
							for (const targetCombatant of targetCombatants) {
								const outcome = predictRoundRnTargeted(adventure, combatant, targetCombatant, move.name, key);
								if (outcome) { outcomes.push(outcome) };
							}
						}

					}
					else {
						const outcome = predictRoundRnTargeted(adventure, combatant, null, move.name, key);
						if (outcome) { outcomes.push(outcome) };
					}
				}
			}
		}
	}
	// delver equipment
	for (let i = 0; i < adventure.delvers.length; i++) {
		let delver = adventure.delvers[i];
		let counterpart = adventure.getCombatant(new CombatantReference("enemy", i));
		let isCloneAlive = false
		if (counterpart) {
			isCloneAlive = counterpart.hp > 0 && counterpart.archetype === "Mirror Clone";
		}
		for (const gear of delver.gear.concat({ name: getArchetypeActionName(delver.archetype, delver.specialization), cooldown: 0 })) {
			if (gear.cooldown === 0) {
				let rnConfig = getGearProperty(gear.name, "rnConfig")
				let targetingTags = getGearProperty(gear.name, "targetingTags")
				if (rnConfig) {
					for (const key in rnConfig) {
						if (rnsConcerningTargets.has(key)) {
							outcomes.push(...predictRoundRnPossibleTargets(adventure, delver, targetingTags, gear.name, key));
							if (isCloneAlive) {
								outcomes.push(...predictRoundRnPossibleTargets(adventure, counterpart, targetingTags, gear.name, key));
							}
						}
						else {
							outcomes.push(predictRoundRnTargeted(adventure, delver, null, gear.name, key));
							if (isCloneAlive) {
								outcomes.push(predictRoundRnTargeted(adventure, counterpart, null, gear.name, key));
							}
						}
					}
				}
			}
		}
		// items
		if ("Panacea" in adventure.items) {
			if (Object.keys(delver.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff").length > 2) {
				outcomes.push(predictRoundRnTargeted(adventure, delver, delver, "Panacea", "debuffs"))
				if (isCloneAlive) {
					outcomes.push(predictRoundRnTargeted(adventure, counterpart, counterpart, "Panacea", "debuffs"))
				}
			}
		}
	}
	return outcomes;
}

/**
 * Given a move and delver BUT NOT THE TARGET for a random-concerned-move that depends on targets, return a predicted outcome.
 * @param {Adventure} adventure
 * @param {Combatant} user
 * @param {"foes" | "allies" | "essences" | string} targetingTags
 * @param {"foes" | "allies" | "essences" | string} moveName
 * @param {Record<string, number>} config
 */
function predictRoundRnPossibleTargets(adventure, user, targetingTags, moveName, key) {
	const liveEnemies = adventure.room.enemies.filter(e => e.hp > 0);
	let targetCombatants = [];
	let results = [];
	switch (targetingTags.team) {
		case "ally":
			if (targetingTags.type === "self") {
				targetCombatants = [user];
			}
			else {
				targetCombatants = user.team === "delver" ? adventure.delvers : liveEnemies;
			}
			break;
		case "foe":
			targetCombatants = user.team !== "delver" ? adventure.delvers : liveEnemies;
			break;
		case "any":
			targetCombatants = adventure.delvers.concat(liveEnemies);
			break;
		case "none":
			break;
	}
	for (const targetCombatant of targetCombatants) {
		const rnOutcome = predictRoundRnTargeted(adventure, user, targetCombatant, moveName, key);
		if (rnOutcome) {
			results.push(rnOutcome);
		}
	}
	return results;
}

/**
 * Simulate the (consecutive) removal of modifiers by the indices indicated by the roundRnKey
 * @param {Combatant} target
 * @param {Combatant} user
 * @param {string} moveName
 * @param {string} roundRnKeyname
 * @param {string[]} targetModifiers
 */
function predictRemovedModifiers(target, user, moveName, roundRnKeyname, targetModifiers) {
	let popped = [];
	for (const idx of user.roundRns[roundRnKeyname]) {
		const modIdx = idx % targetModifiers.length;
		const [removedModifier] = targetModifiers.splice(modIdx, 1);
		popped.push(getApplicationEmojiMarkdown(removedModifier));
	}
	return `${user.name}'s ${moveName} will remove ${popped.join("")} from ${target.name}`;
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
				combatant.roundRns = {};
				if (combatant.team === "delver") {
					const boatPartsCount = adventure.getArtifactCount("Boat Parts");
					if (boatPartsCount > 0 && adventure.room.round <= boatPartsCount + 1) {
						const boatProtection = boatPartsCount * 25 + 25;
						addProtection([combatant], boatProtection);
						adventure.updateArtifactStat("Boat Parts", "Protection Generated", boatProtection);
					}

					const peacockCharmCount = adventure.getArtifactCount("Peacock Charm");
					if (peacockCharmCount > 0) {
						const peacockProtection = peacockCharmCount + combatant.poise - combatant.stagger;
						addProtection([combatant], peacockProtection);
						adventure.updateArtifactStat("Peacock Charm", "Protection Generated", peacockProtection);
					}
					// (pre-/) roll for delver gear rn's for this round
					for (const actionName of combatant.gear.map(gear => gear.name).concat(getArchetypeActionName(combatant.archetype, combatant.specialization))) {
						const rnConfig = getGearProperty(actionName, "rnConfig");
						if (rnConfig) {
							cacheRoundRn(adventure, combatant, actionName, rnConfig);
						}
					}
					if ("Panacea" in adventure.items) {
						cacheRoundRn(adventure, combatant, "Panacea", { debuffs: 2 })
					}
				}

				// Roll Round Speed
				const percentBonus = (adventure.generateRandomNumber(21, "battle") - 10) / 100;
				combatant.roundSpeed = Math.floor(combatant.speed * percentBonus);

				// Roll Critical
				let modifierCritBonus = 1;
				if ("Finesse" in combatant.modifiers) {
					modifierCritBonus = 2;
				} else if ("Clumsiness" in combatant.modifiers) {
					modifierCritBonus = 0.5;
				}
				const baseCritChance = combatant.getCritRate() / 100 * modifierCritBonus;
				const max = RN_TABLE_BASE ** 2;
				let threshold;
				if (combatant.team === "delver") {
					const featherCount = adventure.getArtifactCount("Hawk Tailfeather");
					if (featherCount > 0) {
						threshold = max * anyDieSucceeds(baseCritChance, featherCount);
						adventure.updateArtifactStat("Hawk Tailfeather", "Expected Extra Criticals", (threshold / max) - baseCritChance);
					}
				}
				if (threshold === undefined) {
					threshold = max * baseCritChance;
				}
				const critRoll = adventure.generateRandomNumber(max, "battle");
				combatant.crit = critRoll < threshold;

				// Roll Enemy Moves
				if (teamName === "enemy") {
					if (combatant.archetype !== "Mirror Clone") {
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
						const move = new Move(actionName, "action", new CombatantReference(combatant.team, i))
							.setSpeedByCombatant(combatant)
							.setPriority(enemyTemplate.actions[actionName].priority);
						enemyTemplate.actions[actionName].selector(combatant, adventure).forEach(({ team, index }) => {
							move.addTarget(new CombatantReference(team, index));
						});
						adventure.room.moves.push(move);
						if (enemyTemplate.actions[actionName].rnConfig) {
							// (pre-/) roll for enemy move rn's for this round
							cacheRoundRn(adventure, combatant, actionName, enemyTemplate.actions[actionName].rnConfig);
						}
						combatant.nextAction = enemyTemplate.actions[actionName].next;
					} else {
						adventure.room.moves.push(
							new Move("Mirror Clone", "action", new CombatantReference(combatant.team, i))
								.setSpeedByCombatant(combatant)
						);
						// (pre-/) roll for clones' use of delver gear rn's for this round
						const counterpart = adventure.getCombatant(new CombatantReference("delver", i))
						for (const actionName of counterpart.gear.map(gear => gear.name).concat(getArchetypeActionName(counterpart.archetype, counterpart.specialization))) {
							const rnConfig = getGearProperty(actionName, "rnConfig");
							if (rnConfig) {
								cacheRoundRn(adventure, combatant, actionName, rnConfig);
							}
						}
						if ("Panacea" in adventure.items) {
							cacheRoundRn(adventure, combatant, "Panacea", { debuffs: 2 });
						}
					}
				}
			})
	}

	// generate rn prediction outcomes and splice x random outcomes to keep
	const allOutcomes = predictRoundRnOutcomes(adventure);
	const numChosenOutcomes = 5;
	adventure.room.randomOutcomesPredicts = [];
	for (let i = 0; i < numChosenOutcomes; i++) {
		if (allOutcomes.length > 0) {
			adventure.room.randomOutcomesPredicts.push(...allOutcomes.splice(adventure.generateRandomNumber(allOutcomes.length, "battle"), 1));
		}
	}

	if (adventure.room.round % 2 === 1) {
		// Generate pet move
		const owner = adventure.delvers[adventure.petRNs.delverIndex];
		if (owner.pet.type !== "") {
			const petMoveTemplate = getPetMove(owner.pet, adventure.petRNs.moveIndex);
			const petMove = new Move(petMoveTemplate.name, "pet", { team: "delver", index: adventure.petRNs.delverIndex })
				.setSpeedByValue(100);
			petMoveTemplate.selector(owner, adventure.petRNs).forEach(reference => {
				petMove.addTarget(reference);
			})
			adventure.room.moves.push(petMove);
		}
	}

	thread.send(renderRoom(adventure, thread, lastRoundText)).then(message => {
		if (!checkNextRound(adventure)) {
			message.edit({ embeds: message.embeds.map(embed => new EmbedBuilder(embed).setAuthor({ name: roomHeaderString(adventure), iconURL: message.client.user.displayAvatarURL() })) });
			adventure.messageIds.battleRound = message.id;
		} else {
			clearComponents(message.id, thread.messages);
			endRound(adventure, thread);
		}
		setAdventure(adventure);
	});
}

/** Updates game state with the move's effect AND returns the game's description of what happened
 * @param {Move} move
 * @param {Adventure} adventure
 */
function resolveMove(move, adventure) {
	const user = adventure.getCombatant(move.userReference);
	if (!user || user.hp < 1) {
		return "";
	}

	let headline = `${bold(user.name)} `;
	const results = [];
	const [moveName, index] = move.name.split(SAFE_DELIMITER);
	if (!user.isStunned || moveName.startsWith("Unstoppable") || move.type === "pet") {
		if (user.crit) {
			headline = `💥${headline}`;
		}

		let effect;
		switch (move.type) {
			case "action":
				if (move.userReference.team !== "delver") {
					const action = getEnemy(user.archetype).actions[moveName];
					effect = action.effect;
					headline += `used ${moveName}`;
					if (action.combatFlavor) {
						headline += ` ${italic(action.combatFlavor)}`;
					}
				}
				break;
			case "gear": {
				effect = getGearProperty(moveName, "effect");
				headline += `used ${moveName}`;
				const targetingTags = getGearProperty(moveName, "targetingTags");
				if (user.team === "delver") {
					const loadedDiceCount = adventure.getArtifactCount("Loaded Dice");
					if (loadedDiceCount > 0 && targetingTags.type.startsWith("random")) {
						adventure.updateArtifactStat("Loaded Dice", "Extra Targets", loadedDiceCount);
					}
				}
				break;
			}
			case "item": {
				let isPlacebo = false;
				if (user.team === "delver") {
					const placeboDillution = adventure.getChallengeIntensity("Unlabelled Placebos");
					const placeboDuration = adventure.getChallengeDuration("Unlabelled Placebos");
					if (placeboDillution > 0 && placeboDuration > 0) {
						isPlacebo = (placeboDillution - 1) === adventure.generateRandomNumber(placeboDillution, "battle");
					}
					adventure.decrementItem(moveName, 1);
				}
				effect = getItem(isPlacebo ? "Placebo" : moveName).effect;
				headline += `used ${moveName}`;
				break;
			}
			case "pet":
				effect = getPetMove(user.pet, adventure.petRNs.moveIndex).effect;
				headline = `${user.name}'s ${bold(user.pet.type)} used ${moveName}`;
				break;
		}

		let shouldDoGearUpkeep = user.team === "delver" && move.type === "gear" && index !== "@{archetypeAction}" && !["Appease", "Greed"].includes(moveName);
		if (move.targets.length > 0) {
			const livingTargets = [];
			const deadTargets = [];
			move.targets.forEach(targetReference => {
				const target = adventure.getCombatant(targetReference);
				if (target) {
					if (target.hp > 0) {
						livingTargets.push(target);
					} else {
						deadTargets.push(target);
					}
				}
			})
			if (livingTargets.length > 0) {
				if (deadTargets.length > 0) {
					results.push(`${listifyEN(deadTargets.map(target => target.name), false)} ${deadTargets.length === 1 ? "was" : "were"} already dead!`);
				}

				results.push(...effect(livingTargets, user, adventure, adventure.petRNs));
			} else {
				shouldDoGearUpkeep = false;
				if (move.targets.length === 1) {
					headline += `, but ${adventure.getCombatant(move.targets[0]).name} was already dead!`;
				} else {
					headline += `, but all targets were already dead!`;
				}
			}
		} else {
			results.push(...effect([], user, adventure, adventure.petRNs));
		}

		if (shouldDoGearUpkeep) {
			const gear = user.gear[index];
			const gearCategory = getGearProperty(moveName, "category");

			const cooldown = getGearProperty(gear.name, "cooldown");
			if (cooldown !== undefined) {
				let cdReduction = 0;
				if (gearCategory === "Offense") {
					const weaponPolishCount = adventure.getArtifactCount("Weapon Polish");
					if (weaponPolishCount > 0) {
						const chargeSaveChance = 1 - 0.85 ** weaponPolishCount;
						const max = RN_TABLE_BASE ** 2;
						adventure.updateArtifactStat("Weapon Polish", "Expected Cooldown Saved", chargeSaveChance.toFixed(2));
						if (adventure.generateRandomNumber(max, "battle") < max * chargeSaveChance) {
							cdReduction = 1;
							adventure.updateArtifactStat("Weapon Polish", "Actual Cooldown Saved", 1);
						}
					}
				}
				gear.cooldown = Math.max(0, cooldown - cdReduction);
			}

			if (gearCategory === "Spell") {
				const crystalShardCount = adventure.getArtifactCount("Crystal Shard");
				if (crystalShardCount > 0) {
					const chargeSaveChance = 1 - 0.85 ** crystalShardCount;
					const max = RN_TABLE_BASE ** 2;
					adventure.updateArtifactStat("Crystal Shard", "Expected Charges Saved", chargeSaveChance.toFixed(2));
					if (adventure.generateRandomNumber(max, "battle") < max * chargeSaveChance) {
						adventure.updateArtifactStat("Crystal Shard", "Actual Charges Saved", 1);
					}
				}
			}

			if (getGearProperty(moveName, "maxCharges") > 0) {
				gear.charges--;
				if (gear.charges < 1) {
					results.push(`${user.name}'s ${moveName} is exhausted!`);
				}
			}
		}

		const insigniaCount = adventure.getArtifactCount("Celestial Knight Insignia");
		if (insigniaCount > 0 && user.team === "delver" && user.crit && move.type !== "pet") {
			const insigniaHealing = insigniaCount * 15;
			results.push(gainHealth(user, insigniaHealing, adventure, "their Celestial Knight Insigina"));
			adventure.updateArtifactStat("Health Restored", insigniaHealing);
		}
	} else {
		headline = `💫 ${headline} is Stunned!`;
		if ("Progress" in user.modifiers) {
			results.push(`${user.name} loses some ${getApplicationEmojiMarkdown("Progress")}!`)
			user.modifiers.Progress = Math.ceil(user.getModifierStacks("Progress") * 0.8);
		}

		if ("Frailty" in user.modifiers) {
			results.push(...dealModifierDamage(userReference, "Frailty", adventure));
			removeModifier([user], { name: "Frailty", stacks: "all" });
		}
	}

	if (move.type !== "pet") {
		// Poison/Regeneneration effect
		if ("Poison" in user.modifiers) {
			results.push(...dealModifierDamage(user, "Poison", adventure));
		} else {
			const regenStacks = user.getModifierStacks("Regeneration");
			if (regenStacks) {
				results.push(gainHealth(user, regenStacks * 10, adventure, "Regeneration"));
			}
		}

		// Decrement modifiers with move decrement
		for (const modifier in user.modifiers) {
			const moveDecrement = getMoveDecrement(modifier);
			if (moveDecrement !== 0) {
				removeModifier([user], { name: modifier, stacks: moveDecrement });
			}
		}
	}

	return `${headline}${results.reduce((contextLines, currentLine) => `${contextLines}\n-# ${bold(currentLine)}`, "")}\n`;
}

const RETAINING_MODIFIER_PAIRS = [["Exposure", "Distraction"], ["Evasion", "Vigilance"]];

/** Generate reactive moves, randomize speed ties, then resolve moves
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 */
function endRound(adventure, thread) {
	if ("endedCombat" in adventure.room.history) {
		return;
	}

	clearComponents(adventure.messageIds.battleRound, thread.messages);

	const randomOrderBag = Array(adventure.room.moves.length).fill().map((_, idx) => idx) // ensure that unique values are available for each move
	for (const move of adventure.room.moves) {
		// Randomize speed ties
		const rIdx = adventure.generateRandomNumber(randomOrderBag.length, "battle");
		move.randomOrder = randomOrderBag.splice(rIdx, 1)[0]; // pull a remaining randomOrder out of the bag and assign it to a move

		// Generate Reactive Moves by Enemies
		const user = adventure.getCombatant(move.userReference);
		if (user.archetype === "Mirror Clone") {
			const counterpartMove = adventure.room.findCombatantMove({ index: move.userReference.index, team: "delver" });
			move.type = counterpartMove.type;
			move.name = counterpartMove.name;
			move.setPriority(counterpartMove.priority);
			const [gearName, gearIndex] = counterpartMove.name.split(SAFE_DELIMITER);
			if (gearExists(gearName)) {
				const targetingTags = getGearProperty(gearName, "targetingTags");
				if (targetingTags.type === "single" || targetingTags.type.startsWith("blast")) {
					move.targets = counterpartMove.targets.map(target => {
						return { team: target.team === "enemy" ? "delver" : "enemy", index: target.index };
					})
				} else if (targetingTags.type === "all") {
					if (targetingTags.team === "ally") {
						for (let i = 0; i < adventure.room.enemies; i++) {
							if (adventure.room.enemies[i].hp > 0) {
								move.addTarget(new CombatantReference("enemy", i));
							}
						}
					} else {
						for (let i = 0; i < adventure.delvers.length; i++) {
							move.addTarget(new CombatantReference("delver", i));
						}
					}
				} else if (targetingTags.type.startsWith("random")) {
					const { [`${gearName}${SAFE_DELIMITER}allies`]: cachedAllies, [`${gearName}${SAFE_DELIMITER}foes`]: cachedFoes } = cacheRoundRn(adventure, user, gearName, getGearProperty(gearName, "rnConfig"));
					if (cachedAllies) {
						for (let i = 0; i < cachedAllies.length; i++) {
							move.addTarget(new CombatantReference(move.userReference.team, cachedAllies[i]));
						}
					}
					if (cachedFoes) {
						for (let i = 0; i < cachedFoes.length; i++) {
							move.addTarget(new CombatantReference(move.userReference.team === "delver" ? "enemy" : "delver", cachedFoes[i]));
						}
					}
				} else if (targetingTags.type === "self") {
					move.targets = [{ team: "enemy", index: move.userReference.index }];
				}
			} else {
				move.targets = counterpartMove.targets.map(target => {
					return { team: target.team === "enemy" ? "delver" : "enemy", index: target.index };
				})
			}
		}
	}

	adventure.room.moves.sort(Move.compareMoveSpeed)

	// Resolve moves
	let lastRoundText = "";
	for (const move of adventure.room.moves) {
		const combatant = adventure.getCombatant(move.userReference);
		if (combatant.team === "delver" && move.type !== "pet") {
			combatant.gear.forEach(gear => {
				if (gear.cooldown > 0) {
					gear.cooldown--;
				}
			})
		}
		lastRoundText += resolveMove(move, adventure);

		const combatState = adventure.getCombatState();
		if (combatState !== "continue") {
			handleEndCombat(combatState, adventure, thread, lastRoundText);
			return;
		}
	}
	adventure.room.moves = [];

	/** @type {Combatant[]} */
	const combatants = adventure.delvers.concat(adventure.room.enemies);
	for (const combatant of combatants) {
		if (combatant.isStunned) {
			combatant.isStunned = false;
			combatant.stagger = 0;
		} else if (combatant.stagger >= combatant.getPoise()) {
			combatant.isStunned = true;
		} else {
			changeStagger([combatant], null, -1);
		}

		const otherHappenings = [];
		if ("Fortune" in combatant.modifiers && combatant.modifiers.Fortune % 7 === 0) {
			addProtection([combatant], combatant.getModifierStacks("Fortune") * 30);
			removeModifier([combatant], { name: "Fortune", stacks: "all" });
			otherHappenings.push(`${combatant.name}'s Fortune becomes protection.`);
		}
		if ("Misfortune" in combatant.modifiers && combatant.modifiers.Misfortune % 7 === 0) {
			otherHappenings.push(dealModifierDamage(combatant, "Misfortune", adventure));
			removeModifier([combatant], { name: "Misfortune", stacks: "all" });
		}
		if (otherHappenings.length > 0) {
			lastRoundText += `Other Happenings\n-# ${otherHappenings.join("\n-# ")}`
		}

		const combatState = adventure.getCombatState();
		if (combatState !== "continue") {
			handleEndCombat(combatState, adventure, thread, lastRoundText);
			return;
		}

		// Decrement Modifiers
		for (const modifier in combatant.modifiers) {
			const roundDecrement = getRoundDecrement(modifier);
			if (roundDecrement !== 0 && !RETAINING_MODIFIER_PAIRS.some(([retainee, retainer]) => modifier === retainee && retainer in combatant.modifiers)) {
				removeModifier([combatant], { name: modifier, stacks: roundDecrement })
			}
		}
	}

	if (adventure.room.round % 2 === 1) {
		// Generate pet move prediction
		adventure.petRNs.delverIndex = (adventure.petRNs.delverIndex + 1) % adventure.delvers.length;
		generatePetRNs(adventure);
	}

	newRound(adventure, thread, lastRoundText);
}

/**
 * @param {"defeat" | "victory"} combatState
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {string} lastRoundText
 */
function handleEndCombat(combatState, adventure, thread, lastRoundText) {
	adventure.room.history.endedCombat = [];
	adventure.room.round++;
	switch (combatState) {
		case "defeat":
			thread.send(completeAdventure(adventure, thread, "defeat", lastRoundText));
			return;
		case "victory":
			if (adventure.depth >= getLabyrinthProperty(adventure.labyrinth, "maxDepth")) {
				thread.send(completeAdventure(adventure, thread, "success", lastRoundText));
				return;
			}

			for (const resourceName in adventure.room.resources) {
				const resource = adventure.room.resources[resourceName];
				if (resource.type === "levelsGained") {
					const [_, index] = resourceName.split(SAFE_DELIMITER);
					if (!index) {
						for (const delver of adventure.delvers) {
							levelUp(delver, resource.count, adventure);
						}
					} else {
						levelUp(adventure.delvers[index], resource.count, adventure);
					}
				}
			}

			// Gear drops
			const gearThreshold = 1;
			const gearMax = 4;
			if (adventure.generateRandomNumber(gearMax, "general") < gearThreshold) {
				const tier = rollGearTier(adventure);
				const droppedGear = rollGear(tier, adventure);
				if (droppedGear) {
					adventure.room.addResource(droppedGear, "Gear", "loot", 1);
				}
			}

			// Item drops
			const itemThreshold = 1;
			const itemMax = 4;
			if (adventure.generateRandomNumber(itemMax, "general") < itemThreshold) {
				adventure.room.addResource(rollItem(adventure), "Item", "loot", 1);
			}
			thread.send(renderRoom(adventure, thread, lastRoundText)).then(message => {
				adventure.messageIds.battleRound = message.id;
			});
	}
}

/** The round ends when all combatants have readied all their moves
 * @param {Adventure} adventure
 */
function checkNextRound({ petRNs, room, delvers }) {
	const readiedMoves = room.moves.length;
	const petMoves = delvers[petRNs.delverIndex].pet.type !== "" ? room.round % 2 : 0;
	const movesThisRound = room.enemies.length + delvers.length + petMoves;
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
		recruitMessage.edit({
			embeds: [generateRecruitEmbed(adventure)],
			components: []
		});
	})
	clearComponents(adventure.messageIds.battleRound, messageManager);
	clearComponents(adventure.messageIds.room, messageManager);

	if (adventure.room.resources?.Gold?.count > 0) {
		adventure.gainGold(adventure.room.resources.Gold.count);
	}
	adventure.state = endState;
	setAdventure(adventure);
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
	completeAdventure,
	cacheRoundRn
};

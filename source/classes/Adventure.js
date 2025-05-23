const crypto = require("crypto");
const { RN_TABLE_BASE, GAME_VERSION } = require("../constants.js");
const { CombatantReference, Move } = require("./Move.js");
const { Combatant, Delver } = require("./Combatant.js");
const { essenceList, getOpposite } = require("../util/essenceUtil.js");
const { parseExpression } = require("../util/mathUtil.js");
const { MessageLimits } = require("@sapphire/discord.js-utilities");

/** @typedef {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} Essence */
const ESSENCES = essenceList();
const DESCRIPTORS = ["Shining", "New", "Dusty", "Old", "Floating", "Undersea", "Future", "Intense"];

class Adventure {
	/** NOTE: setId is require for a well formed entity. Currently procrastinating on refactoring /delve to fix that.
	 * @param {string} seedInput
	 * @param {string} guildIdInput
	 * @param {string} labyrinthInput
	 * @param {string} leaderIdInput
	 */
	constructor(seedInput, guildIdInput, labyrinthInput, leaderIdInput) {
		this.version = GAME_VERSION;
		this.initialSeed = seedInput || Date.now().toString();
		this.rnTable = crypto.createHash("sha256").update(this.initialSeed).digest("hex");
		this.guildId = guildIdInput;
		this.labyrinth = labyrinthInput;
		this.leaderId = leaderIdInput;
		this.essence = ESSENCES[this.generateRandomNumber(ESSENCES.length, "general")];
		this.name = `${DESCRIPTORS[this.generateRandomNumber(DESCRIPTORS.length, "general")]} ${labyrinthInput} of ${this.essence}`;
	}
	/** @type {string} should match the id of the adventure's thread */
	id;
	/** @type {string} */
	name;
	/** @type {Essence} */
	essence;
	/** @type {"config" | "ongoing" | "success" | "defeat" | "giveup"} */
	state = "config";
	static endStates = ["success", "defeat", "giveup"];
	messageIds = {
		recruit: "",
		room: "",
		battleRound: ""
	};
	/** @type {Delver[]} */
	delvers = [];
	/** @type {{[challengeName: string]: Challenge}} */
	challenges = {};
	scouting = {
		bosses: 0,
		bossesEncountered: 0,
		artifactGuardians: 0,
		artifactGuardiansEncountered: 0
	}
	/** @type {string[]} */
	bosses = [];
	/** @type {string[]} */
	artifactGuardians = [];
	score = 0;
	depth = 1;
	/** @type {Room} */
	room = {};
	/** @type {{delverIndex: number, moveIndex: number, targetReferences: CombatantReference[], extras: number[]}} */
	petRNs = { delverIndex: 0, moveIndex: 0, targetReferences: [], extras: [] };
	/** @type {{[candidate: string]: {voterIds: string[], isHidden: boolean}}} */
	roomCandidates = {};
	/** @type {number} */
	lives;
	/** @type {number} */
	gold;
	/** @type {number} */
	peakGold;
	gearCapacity = 2;
	/** @type {Record<string, {count: number; [statistic: string]: number}>} */
	artifacts = {};
	/** @type {{[itemName: string]: number}} */
	items = {};
	rnIndices = {
		general: 0,
		battle: 0
	};
	rnTable = "";

	/** @param {string} threadId */
	setId(threadId) {
		this.id = threadId;
		return this;
	}

	/** Generate an integer between 0 and the given `exclusiveMax`
	 * @param {number} exclusiveMax the integer after the max roll
	 * @param {"general" | "battle"} branch which rnTable branch to roll on
	 */
	generateRandomNumber(exclusiveMax, branch) {
		if (typeof exclusiveMax !== 'number' || isNaN(exclusiveMax) || exclusiveMax === 0) {
			throw new Error(`generateRandomNumber recieved invalid exclusiveMax: ${exclusiveMax}`);
		}

		if (exclusiveMax === 1) {
			return 0;
		} else {
			const digits = Math.ceil(Math.log2(exclusiveMax) / Math.log2(RN_TABLE_BASE));
			const start = this.rnIndices[branch];
			const end = start + digits;
			this.rnIndices[branch] = end % this.rnTable.length;
			const max = RN_TABLE_BASE ** digits;
			const sectionLength = max / exclusiveMax;
			let tableSegment = this.rnTable.slice(start, end);
			if (start > end) {
				tableSegment = `${this.rnTable.slice(start)}${this.rnTable.slice(0, end)}`;
			}
			const roll = parseInt(tableSegment, RN_TABLE_BASE);
			return Math.floor(roll / sectionLength);
		}
	}

	getCombatState() {
		if (this.lives <= 0) {
			return "defeat";
		}

		if (this.room.enemies.every(enemy => enemy.hp === 0 || "Cowardice" in enemy.modifiers)) {
			return "victory";
		}

		return "continue";
	}

	/** Calculates the adventure's score without end of run multipliers */
	getBaseScore() {
		const livesScore = this.lives ?? 0 * 10;
		const goldScore = Math.floor(Math.log10(this.peakGold) || 0) * 5;
		const guardianScore = this.scouting.artifactGuardiansEncountered * 5;
		const artifactMultiplier = 1 + (this.getArtifactCount("Bejewled Treasuresphere") / 4);
		return {
			livesScore,
			goldScore,
			guardianScore,
			total: Math.floor((this.score + this.depth + livesScore + goldScore + guardianScore) * artifactMultiplier)
		};
	}

	/** Get an array with Unaligned and all essences in the party
	 * @returns {Essence[]}
	 */
	getPartyEssences() {
		const pool = ["Unaligned"];
		this.delvers.forEach(delver => {
			if (!pool.includes(delver.essence)) {
				return pool.push(delver.essence);
			}
		})
		return pool;
	}

	/** @param {string} artifactName */
	getArtifactCount(artifactName) {
		return this.artifacts[artifactName]?.count || 0;
	}

	/** @param {string} challengeName */
	getChallengeIntensity(challengeName) {
		return this.challenges[challengeName]?.intensity || 0;
	}

	/** @param {string} challengeName */
	getChallengeDuration(challengeName) {
		return this.challenges[challengeName]?.duration || 0;
	}

	getGearCapacity() {
		let count = this.gearCapacity + this.getArtifactCount("Hammerspace Holster") - this.getChallengeIntensity("Can't Hold All this Value");
		count = Math.min(MessageLimits.MaximumActionRows - 1, count); // Need to leave space for Archetype Action
		count = Math.max(1, count);
		return count;
	}

	/** Get a delver or enemy based on the team and index of the combatant
	 * @param {CombatantReference} reference
	 * @returns {Combatant | null}
	 */
	getCombatant({ team, index }) {
		switch (team) {
			case "delver":
				return this.delvers[index];
			case "enemy":
				return this.room.enemies[index];
		}
	}

	/** @param {Combatant} combatant */
	getCombatantIndex(combatant) {
		if (!combatant) {
			return;
		}
		if (combatant.team === "delver") {
			return this.delvers.findIndex(delver => delver.id === combatant.id);
		} else {
			return this.room.enemies.findIndex(enemy => enemy.id === combatant.id && enemy.name === combatant.name);
		}
	}

	/** @param {number} integer */
	gainGold(integer) {
		this.gold += integer;
		if (this.gold > this.peakGold) {
			this.peakGold = this.gold;
		}
		return this.gold;
	}

	/**
	 * @param {string} artifact
	 * @param {number} count
	 */
	gainArtifact(artifact, count) {
		if (artifact in this.artifacts) {
			this.artifacts[artifact].count += count;
		} else {
			this.artifacts[artifact] = { count };
		}
		if (artifact === "Oil Painting") {
			this.gainGold(500 * count);
			this.updateArtifactStat(artifact, "Gold Gained", 500 * count);
		} else if (artifact === "Phoenix Fruit Blossom") {
			this.lives += count;
			this.updateArtifactStat(artifact, "Lives Gained", count);
		} else if (artifact === "Hammerspace Holster") {
			this.updateArtifactStat(artifact, "Extra Gear Capacity", count);
		}
	}

	/**
	 * @param {string} itemName
	 * @param {number} count
	 */
	gainItem(itemName, count) {
		if (itemName in this.items) {
			this.items[itemName] += count;
		} else {
			this.items[itemName] = count;
		}
	}

	/**
	 * @param {string} itemName
	 * @param {number} count
	 */
	decrementItem(itemName, count) {
		this.items[itemName] -= count;
		if (this.items[itemName] < 1) {
			delete this.items[itemName];
		}
	}

	/**
	 * @param {string} artifactName
	 * @param {string} statName the stat to add to (in case of multiple stats per artifact)
	 * @param {number} stat the amount to be added
	 */
	updateArtifactStat(artifactName, statName, stat) {
		if (this.artifacts[artifactName]) {
			if (statName in this.artifacts[artifactName]) {
				this.artifacts[artifactName][statName] += stat;
			} else {
				this.artifacts[artifactName][statName] = stat;
			}
		}
	}

	/** Applies relics, challenges, etc to scouting cost
	 * @param {"Final Battle" | "Artifact Guardian"} type
	 */
	calculateScoutingCost(type) {
		const count = this.getArtifactCount("Amethyst Spyglass");
		switch (type) {
			case "Final Battle":
				return Math.max(150 - (count * 15), 0);
			case "Artifact Guardian":
				return Math.max(100 - (count * 15), 0);
		}
	}
};

class Challenge {
	/**
	 * @param {number} intensityInput
	 * @param {number} rewardInput
	 * @param {number | null} durationInput
	 */
	constructor(intensityInput, rewardInput, durationInput) {
		this.intensity = intensityInput;
		this.reward = rewardInput;
		this.duration = durationInput;
	}
};

class Room {
	/** This read-write instance class describes a room in an adventure
	 * @param {string} titleInput
	 * @param {Essence} essenceEnum
	 * @param {[enemyName: string, countExpression: string][]} enemyList
	 */
	constructor(titleInput, essenceEnum, enemyList) {
		this.title = titleInput;
		this.essence = essenceEnum;
		if (enemyList && enemyList.length > 0) {
			this.round = -1;
			this.moves = [];
			this.enemies = [];
			this.enemyIdMap = {};
		}
	}
	/** @type {number | null} */
	round = null;
	/** @type {Move[] | null} */
	moves = null;
	/** @type {Enemy[] | null} */
	enemies = null;
	/** @type {{[enemyName: string]: number} | null} */
	enemyIdMap = null;
	morale = 0;
	actions = 0;
	/** @type {Record<string, {name: string, type: "Gear" | "Artifact" | "Currency" | "challenge" | "Item", visibility: "loot" | "always" | "internal", count: number, uiGroup?: string, cost?: number}>} */
	resources = {};
	/** @type {Record<string, string[]>} */
	history = {};
	/** @type {string[]} */
	randomOutcomesPredicts = [];

	/** checks if the given resource has the given count in the room
	 * @param {string} name
	 * @param {number?} count
	 */
	hasResource(name, count = 0) {
		return name in this.resources && this.resources[name].count >= count;
	}

	/** Initializes a resource in the room's resources if it's not already present
	 * @param {string} nameInput Note: all names in the combined pool of gear, artifacts, items, and resources must be unique
	 * @param {"Gear" | "Artifact" | "Currency" | "challenge" | "Item"} typeInput
	 * @param {"loot" | "always" | "internal"} visibilityInput "loot" only shows in end of room loot, "always" always shows in ui, "internal" never shows in ui
	 * @param {number} countInput
	 * @param {string?} uiGroupInput
	 * @param {number?} costInput
	 */
	addResource(nameInput, typeInput, visibilityInput, countInput, uiGroupInput, costInput) {
		if (nameInput in this.resources) {
			this.resources[nameInput].count += countInput;
		} else {
			const resource = {
				name: nameInput,
				type: typeInput,
				visibility: visibilityInput,
				count: countInput
			};
			resource.cost = costInput ?? 0;
			if (uiGroupInput) {
				resource.uiGroup = uiGroupInput;
			}
			this.resources[nameInput] = resource;
		}
	}

	/** decrements a resource's count, deletes if reaching zero
	 * @param {string} name
	 * @param {number | "all"} decrement
	 */
	decrementResource(name, decrement) {
		if (decrement === "all" || this.resources[name].count <= decrement) {
			delete this.resources[name];
		} else {
			this.resources[name].count -= decrement;
		}
	}

	/** @param {CombatantReference} combatantReference */
	findCombatantMove(combatantReference) {
		return this.moves.find(move => move.type !== "pet" && move.userReference.index === combatantReference.index && move.userReference.team === combatantReference.team);
	}
}

class Enemy extends Combatant {
	/** This read-write instance class defines an enemy currently in combat
	 * @param {string} nameInput
	 * @param {Essence} essenceEnum
	 * @param {boolean} shouldRandomizeHP
	 * @param {number} hpInput
	 * @param {number} powerInput
	 * @param {number} speedInput
	 * @param {number} staggerCapExpression
	 * @param {number} critRateInput
	 * @param {string} firstActionName
	 * @param {{[modifierName: string]: number}} startingModifiersShallowCopy
	 * @param {Adventure} adventure
	 */
	constructor(nameInput, essenceEnum, shouldRandomizeHP, hpInput, powerInput, speedInput, staggerCapExpression, critRateInput, firstActionName, startingModifiersShallowCopy, adventure) {
		// allows parameterless class casting on load without crashing
		if (essenceEnum === undefined) {
			super(nameInput, "enemy");
			return;
		}

		if (nameInput !== "Mirror Clone") {
			let parsedName;
			switch (nameInput) {
				case "Slime":
					parsedName = `${adventure.essence} Slime`;
					break;
				case "Ooze":
					parsedName = `${getOpposite(adventure.essence)} Ooze`;
					break;
				default:
					parsedName = nameInput;
			}
			super(parsedName, "enemy");
			if (adventure.room.enemyIdMap[this.name]) {
				adventure.room.enemyIdMap[this.name]++;
				this.id = adventure.room.enemyIdMap[this.name];
				this.name = `${parsedName} ${this.id}`;
			} else {
				adventure.room.enemyIdMap[this.name] = 1;
				this.id = 1;
			}
			if (this.id === 2) { // id is omitted from enemy name until a second of the same type is spawned
				const predecessor = adventure.room.enemies.find(enemy => enemy.archetype === nameInput);
				predecessor.name = `${parsedName} 1`;
			}
			let hpPercent = 85 + 15 * adventure.delvers.length;
			if (shouldRandomizeHP) {
				hpPercent += 10 * (2 - adventure.generateRandomNumber(5, "battle"));
			}
			const pendingHP = Math.ceil(hpInput * hpPercent / 100);
			this.hp = pendingHP;
			this.maxHP = pendingHP;
			switch (essenceEnum) {
				case "@{adventure}":
					/** @type {Essence} */
					this.essence = adventure.essence;
					break;
				case "@{adventureOpposite}":
					this.essence = getOpposite(adventure.essence);
					break;
				default:
					this.essence = essenceEnum;
			}
			this.nextAction = firstActionName;
			this.modifiers = startingModifiersShallowCopy;
			this.power = powerInput;
			this.speed = speedInput;
			this.staggerCap = parseExpression(staggerCapExpression, adventure.delvers.length);
			this.critRate = critRateInput;
		} else { // Mirror Clones
			const counterpart = adventure.delvers[adventure.room.enemies.length];
			super(`Mirror ${counterpart.archetype}`, "enemy");
			const pendingHP = hpInput + counterpart.gear.reduce((totalMaxHP, currentGear) => totalMaxHP + currentGear.maxHP, 0);
			this.hp = pendingHP;
			this.maxHP = pendingHP;
			this.essence = counterpart.essence;
			this.power = powerInput + counterpart.gear.reduce((totalPower, currentGear) => totalPower + currentGear.power, 0);
			this.speed = speedInput + counterpart.gear.reduce((totalSpeed, currentGear) => totalSpeed + currentGear.speed, 0);
			this.staggerCap = parseExpression(staggerCapExpression, adventure.delvers.length) + counterpart.gear.reduce((staggerCap, currentGear) => staggerCap + currentGear.staggerCap, 0);
			this.critRate = critRateInput + counterpart.gear.reduce((totalCritRate, currentGear) => totalCritRate + currentGear.critRate, 0);
		}
		this.archetype = nameInput;
		this.level = adventure.scouting.bossesEncountered;
	}

	getMaxHP() {
		return Math.floor(this.maxHP);
	}

	getPower() {
		return Math.floor(this.power + this.getModifierStacks("Empowerment") - this.getModifierStacks("Weakness"));
	}

	/** @param {boolean} includeRoundSpeed */
	getSpeed(includeRoundSpeed) {
		let totalSpeed = this.speed;
		if (includeRoundSpeed) {
			totalSpeed += this.roundSpeed;
		}
		if ("Torpidity" in this.modifiers) {
			const torpidityStacks = this.getModifierStacks("Torpidity");
			totalSpeed -= torpidityStacks * 5;
		}
		if ("Swiftness" in this.modifiers) {
			const quickenStacks = this.getModifierStacks("Swiftness");
			totalSpeed += quickenStacks * 5;
		}
		return Math.floor(totalSpeed);
	}

	getCritRate() {
		return Math.floor(this.critRate);
	}

	getStaggerCap() {
		return Math.floor(this.staggerCap);
	}

	/** Game Design: no damage cap for enemies to avoid accidental capping */
	getDamageCap() {
		return Infinity;
	}
};

module.exports = {
	Adventure,
	Challenge,
	Enemy,
	Room
}

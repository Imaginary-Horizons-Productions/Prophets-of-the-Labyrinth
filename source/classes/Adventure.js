const crypto = require("crypto");
const { MAX_MESSAGE_ACTION_ROWS } = require("../constants.js");
const { CombatantReference } = require("./Combatant.js");
// const Combatant = require("./Combatant.js");
// const Resource = require("./Resource.js");
// const { Room } = require("./Room.js");
// const Delver = require("./Delver.js");

class Adventure {
	/** This read-write payload class describes an ongoing adventure
	 * @param {string} seedInput
	 * @param {string} guildIdInput
	 * @param {string} threadId the id of the thread created for the adventure
	 * @param {"Fire" | "Earth" | "Untyped" | "Water" | "Wind"} elementInput
	 * @param {string} leaderIdInput
	 */
	constructor(seedInput, guildIdInput, threadId, nameInput, labyrinthInput, elementInput, leaderIdInput) {
		this.initialSeed = seedInput || Date.now().toString();
		this.guildId = guildIdInput;
		this.id = threadId;
		this.name = nameInput;
		this.labyrinth = labyrinthInput;
		this.element = elementInput;
		this.leaderId = leaderIdInput;
	}
	/** @type {"config" | "ongoing" | "success" | "defeat" | "giveup"} */
	state = "config";
	static endStates = ["success", "defeat", "giveup"];
	element;
	messageIds = {
		recruit: "",
		utility: "",
		room: "",
		battleRound: ""
	};
	/** @type {Delver[]} */
	delvers = [];
	/** @type {{[challengeName: string]: Challenge}} */
	challenges = {};
	scouting = {
		finalBoss: false,
		artifactGuardians: 0,
		artifactGuardiansEncountered: 0
	}
	finalBoss = "";
	/** @type {string[]} */
	artifactGuardians = [];
	accumulatedScore = 0;
	depth = 1;
	/** @type {Room} */
	room = {};
	/** @type {{[candidate: string]: string[]}} */
	roomCandidates = {};
	lives = 2;
	gold = 100;
	peakGold = 100;
	/** @type {Record<string, {count: number; [statistic: string]: number}>} */
	artifacts = {};
	/** @type {{[itemName: string]: number}} */
	items = {};
	rnIndices = {
		general: 0,
		battle: 0
	};
	rnTable = "";

	generateRNTable() {
		let hash = crypto.createHash("sha256").update(this.initialSeed).digest("hex");
		let segments = [];
		for (let i = 0; i < hash.length; i += 4) {
			segments.push(hash.slice(i, i + 4));
		}
		this.rnTable = segments.reduce((table, segment) => table + parseInt(segment, 16).toString(12), "");
		return this;
	}

	/** Get an array with Untyped and all elements in the party
	 * @returns {string[]}
	 */
	getElementPool() {
		return this.delvers.reduce((elements, delver) => {
			if (!elements.includes(delver.element)) {
				return [...elements, delver.element];
			} else {
				return elements;
			}
		}, ["Untyped"]);
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

	getEquipmentCapacity() {
		let count = 4 + this.getArtifactCount("Hammerspace Holster") - this.getChallengeIntensity("Can't Hold All this Value");
		count = Math.min(MAX_MESSAGE_ACTION_ROWS, count);
		count = Math.max(1, count);
		return count;
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
		if (artifact === "Oil Painting") {
			this.gainGold(500 * count);
			this.updateArtifactStat(artifact, "Gold Gained", 500 * count);
		} else if (artifact === "Phoenix Fruit Blossom") {
			this.lives += count;
			this.updateArtifactStat(artifact, "Lives Gained", count);
		} else if (artifact === "Hammerspace Holster") {
			this.updateArtifactStat(artifact, "Extra Equipment Capacity", count);
		}
		if (artifact in this.artifacts) {
			this.artifacts[artifact].count += count;
		} else {
			this.artifacts[artifact] = { count: count };
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

	/** Initializes a resource in the room's resources if it's not already present
	 * @param {Resource} resource
	 */
	addResource(resource) {
		if (resource.name in this.room.resources) {
			this.room.resources[resource.name].count += resource.count;
		} else {
			this.room.resources[resource.name] = resource;
		}
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
			case "none":
				return null;
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
}

module.exports = {
	Adventure,
	Challenge
};

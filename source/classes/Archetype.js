const { EmbedBuilder } = require("discord.js");

class Archetype {
	/**
	 * @param {string} nameInput
	 * @param {(embed: EmbedBuilder, adventure ) => [isInfoForNextRound: boolean, embed: EmbedBuilder]} predictFunction
	 * @param {(combatant) => string} miniPredictFunction
	 */
	constructor(nameInput, predictFunction, miniPredictFunction) {
		this.name = nameInput;
		this.predict = predictFunction;
		this.miniPredict = miniPredictFunction;
	}
	maxHP = 300;
	speed = 100;
	/** @type {"Fire" | "Earth" | "Untyped" | "Water" | "Wind"} */
	element = "Untyped";
	/** @type {string[]} */
	startingGear = [];

	/** @param {number} integer */
	setHP(integer) {
		this.maxHP = integer;
		return this;
	}

	/** @param {number} integer */
	setSpeed(integer) {
		this.speed = integer;
		return this;
	}

	/** @param {"Fire" | "Earth" | "Untyped" | "Water" | "Wind"} elementLabel */
	setElement(elementLabel) {
		this.element = elementLabel;
		return this;
	}

	/** @param {string} text */
	setDescription(text) {
		this.description = text;
		return this;
	}

	/** @param {string[]} gearNames */
	setStartingGear(gearNames) {
		this.startingGear = gearNames;
		return this;
	}
};

module.exports.Archetype = Archetype;

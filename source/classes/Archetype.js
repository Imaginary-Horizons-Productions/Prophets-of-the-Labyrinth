const { EmbedBuilder } = require("discord.js");

class Archetype {
	/**
	 * @param {string} nameInput
	 * @param {string} description
	 * @param {"Fire" | "Earth" | "Untyped" | "Water" | "Wind"} elementLabel
	 * @param {string[]} startingGearNames
	 * @param {(embed: EmbedBuilder, adventure ) => [isInfoForNextRound: boolean, embed: EmbedBuilder]} predictFunction
	 * @param {(combatant) => string} miniPredictFunction
	 */
	constructor(nameInput, descriptionInput, elementLabel, startingGearNames, predictFunction, miniPredictFunction) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.element = elementLabel;
		this.startingGear = startingGearNames;
		this.predict = predictFunction;
		this.miniPredict = miniPredictFunction;
	}
	maxHP = 300;
	speed = 100;

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
};

module.exports.Archetype = Archetype;

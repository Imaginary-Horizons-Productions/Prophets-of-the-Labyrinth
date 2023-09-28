const { EmbedBuilder } = require("discord.js");
const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");

class ArchetypeTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} description
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} elementLabel
	 * @param {string[]} startingGearNames
	 * @param {(embed: EmbedBuilder, adventure: Adventure ) => [isInfoForNextRound: boolean, embed: EmbedBuilder]} predictFunction
	 * @param {(combatant) => string} miniPredictFunction
	 */
	constructor(nameInput, descriptionInput, elementLabel, startingGearNames, predictFunction, miniPredictFunction) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!elementLabel) throw new BuildError("Falsy elementLabel");
		if (!startingGearNames) throw new BuildError("Falsy startingGearNames");
		if (!predictFunction) throw new BuildError("Falsy predictFunction");
		if (!miniPredictFunction) throw new BuildError("Falsy miniPredictFunction");

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

module.exports = {
	ArchetypeTemplate
};

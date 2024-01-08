const { EmbedBuilder } = require("discord.js");
const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");
const { Combatant } = require("./Combatant");

class ArchetypeTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} elementLabel
	 * @param {{maxHPGrowth: number, powerGrowth: number, speedGrowth: number, critRateGrowth: number, poiseGrowth: number}} growthRates
	 * @param {string[]} startingGearNames
	 * @param {(embed: EmbedBuilder, adventure: Adventure ) => EmbedBuilder} predictFunction
	 * @param {(combatant: Combatant) => string} miniPredictFunction
	 */
	constructor(nameInput, descriptionInput, elementLabel, { maxHPGrowth, powerGrowth, speedGrowth, critRateGrowth, poiseGrowth }, startingGearNames, predictFunction, miniPredictFunction) {
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
		this.maxHPGrowth = maxHPGrowth;
		this.powerGrowth = powerGrowth;
		this.speedGrowth = speedGrowth;
		this.critRateGrowth = critRateGrowth;
		this.poiseGrowth = poiseGrowth;
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

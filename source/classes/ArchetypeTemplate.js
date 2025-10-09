const { EmbedBuilder } = require("discord.js");
const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");
const { Combatant } = require("./Combatant");

class ArchetypeTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string[]} specializationNames
	 * @param {string} descriptionInput
	 * @param {string} archetypeActionSummary
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} essenceEnum
	 * @param {string[]} tipArray
	 * @param {(embed: EmbedBuilder, adventure: Adventure ) => EmbedBuilder} predictFunction
	 * @param {(combatant: Combatant) => string} miniPredictFunction
	 * @param {Record<"base" | string, string>} archetypeActionsMap
	 * @param {string[]} startingGearNames
	 * @param {{maxHPGrowth: number, powerGrowth: number, speedGrowth: number, critRateGrowth: number, staggerCapGrowth: number}} growthRates
	 */
	constructor(nameInput, specializationNames, descriptionInput, archetypeActionSummary, essenceEnum, tipArray, predictFunction, miniPredictFunction, archetypeActionsMap, startingGearNames, { maxHPGrowth, powerGrowth, speedGrowth, critRateGrowth }) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!specializationNames) throw new BuildError("Falsy specializationNames");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!archetypeActionSummary) throw new BuildError("Falsy archetypeActionSummary");
		if (!essenceEnum) throw new BuildError("Falsy essenceEnum");
		if (!tipArray) throw new BuildError("Falsy tipArray");
		if (!predictFunction) throw new BuildError("Falsy predictFunction");
		if (!miniPredictFunction) throw new BuildError("Falsy miniPredictFunction");
		if (!archetypeActionsMap) throw new BuildError("Falsy archetypeActionsMap");
		if (!startingGearNames) throw new BuildError("Falsy startingGearNames");

		this.name = nameInput;
		this.specializations = specializationNames;
		this.description = descriptionInput;
		this.archetypeActionSummary = archetypeActionSummary;
		this.essence = essenceEnum;
		this.tips = tipArray;
		this.predict = predictFunction;
		this.miniPredict = miniPredictFunction;
		this.archetypeActions = archetypeActionsMap;
		this.startingGear = startingGearNames;
		this.maxHPGrowth = maxHPGrowth;
		this.powerGrowth = powerGrowth;
		this.speedGrowth = speedGrowth;
		this.critRateGrowth = critRateGrowth;
	}
	maxHP = 300;
	speed = 100;
};

module.exports = {
	ArchetypeTemplate
};

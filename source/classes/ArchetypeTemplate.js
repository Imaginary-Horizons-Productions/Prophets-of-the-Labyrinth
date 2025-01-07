const { EmbedBuilder } = require("discord.js");
const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");
const { Combatant } = require("./Combatant");

class ArchetypeTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string[]} specializationNames
	 * @param {string} descriptionInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} essenceEnum
	 * @param {(embed: EmbedBuilder, adventure: Adventure ) => EmbedBuilder} predictFunction
	 * @param {(combatant: Combatant) => string} miniPredictFunction
	 * @param {Record<"base" | string, string>} archetypeActionsMap
	 * @param {string[]} startingGearNames
	 * @param {{maxHPGrowth: number, powerGrowth: number, speedGrowth: number, critRateGrowth: number, poiseGrowth: number}} growthRates
	 */
	constructor(nameInput, specializationNames, descriptionInput, essenceEnum, predictFunction, miniPredictFunction, archetypeActionsMap, startingGearNames, { maxHPGrowth, powerGrowth, speedGrowth, critRateGrowth }) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!specializationNames) throw new BuildError("Falsy specializationNames");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!essenceEnum) throw new BuildError("Falsy essenceEnum");
		if (!predictFunction) throw new BuildError("Falsy predictFunction");
		if (!miniPredictFunction) throw new BuildError("Falsy miniPredictFunction");
		if (!archetypeActionsMap) throw new BuildError("Falsy archetypeActionsMap");
		if (!startingGearNames) throw new BuildError("Falsy startingGearNames");

		this.name = nameInput;
		this.specializations = specializationNames;
		this.description = descriptionInput;
		this.essence = essenceEnum;
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

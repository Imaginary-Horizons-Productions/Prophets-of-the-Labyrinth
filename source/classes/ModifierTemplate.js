const { BuildError } = require("./BuildError");

class ModifierTemplate {
	/** Template for combatant buffs and debuffs
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {"Buff" | "Debuff" | "State"} categoryEnum
	 * @param {number | "all"} moveDecrementInput
	 * @param {number | "all"} roundDecrementInput
	 */
	constructor(nameInput, descriptionInput, categoryEnum, moveDecrementInput, roundDecrementInput) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!categoryEnum) throw new BuildError("Falsy categoryEnum");
		if (!moveDecrementInput && moveDecrementInput !== 0) throw new BuildError("Nonzero falsy moveDecrementInput");
		if (!roundDecrementInput && roundDecrementInput !== 0) throw new BuildError("Nonzero falsy roundDecrementInput");

		this.name = nameInput;
		this.description = descriptionInput;
		this.category = categoryEnum;
		this.moveDecrement = moveDecrementInput;
		this.roundDecrement = roundDecrementInput;
	}
	inverse = "";

	/** @param {string} modifierName */
	setInverse(modifierName) {
		this.inverse = modifierName;
		return this;
	}
};

module.exports = {
	ModifierTemplate
};

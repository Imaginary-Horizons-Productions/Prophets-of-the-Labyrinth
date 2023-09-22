class ModifierTemplate {
	/** Template for combatant buffs and debuffs
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {boolean} isBuffInput
	 * @param {boolean} isDebuffInput
	 * @param {boolean} isNonStackingInput
	 * @param {number} turnDecrementInput
	 */
	constructor(nameInput, descriptionInput, isBuffInput, isDebuffInput, isNonStackingInput, turnDecrementInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.isBuff = isBuffInput;
		this.isDebuff = isDebuffInput;
		this.isNonStacking = isNonStackingInput;
		this.turnDecrement = turnDecrementInput;
	}
	inverse = "";

	setInverse(modifierName) {
		this.inverse = modifierName;
		return this;
	}
};

module.exports = {
	ModifierTemplate
};

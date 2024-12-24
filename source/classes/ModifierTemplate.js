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

class ModifierReceipt {
	/**
	 * @param {string} combatantNameInput
	 * @param {"add" | "remove"} receiptType
	 * @param {string[]} succeededEmojiArray
	 */
	constructor(combatantNameInput, receiptType, succeededEmojiArray) {
		this.combatantNames = new Set([combatantNameInput]);
		this.type = receiptType;
		this.succeeded = new Set(succeededEmojiArray);
	}

	/** @param {ModifierReceipt} incomingReceipt */
	combineCombatantNames(incomingReceipt) {
		for (const name of incomingReceipt.combatantNames) {
			this.combatantNames.add(name);
		}
	}

	/** @param {ModifierReceipt} incomingReceipt */
	combineModifierSets(incomingReceipt) {
		for (const success of incomingReceipt.succeeded) {
			this.succeeded.add(success);
		}
	}
}

module.exports = {
	ModifierTemplate,
	ModifierReceipt
};

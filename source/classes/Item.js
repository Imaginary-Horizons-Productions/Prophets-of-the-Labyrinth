class ItemTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {(userTeam: "delver" | "enemy" | "none", userIndex: number, adventure) => []} selectTargetsFunction
	 * @param {(targets, user, isCrit: boolean, adventure) => string} effectFunction
	 */
	constructor(nameInput, descriptionInput, selectTargetsFunction, effectFunction) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.selectTargets = selectTargetsFunction;
		this.effect = effectFunction;
	}
	/** @type {"Fire" | "Earth" | "Untyped" | "Water" | "Wind"} */
	element = "";
	/** @param {"single" | "all" | "random→x" | "self" | "none"} */
	targetDescription = "";
	targetTeam = "";
	flavorText = [];
	cost = 10;

	/** @param {string} elementEnum	 */
	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	/** Unlike the selector function which controls the game logic, these tags control UI/feedback logic
	 * @param {"single" | "all" | "random→x" | "self" | "none"} targetDescriptionEnum
	 * @param {"delver" | "enemy" | "any" | "none"} targetTeamEnum
	 */
	setTargetTags(targetDescriptionEnum, targetTeamEnum) {
		this.targetDescription = targetDescriptionEnum;
		this.targetTeam = targetTeamEnum;
		return this;
	}

	/** Sets the texts to display in the flavor text embed field
	 * @param {{name: string, value: string}[]} fieldArray
	 */
	setFlavorText(fieldArray) {
		this.flavorText = fieldArray;
		return this;
	}

	/** @param {number} integer */
	setCost(integer) {
		this.cost = integer;
		return this;
	}
};

module.exports.ItemTemplate = ItemTemplate;

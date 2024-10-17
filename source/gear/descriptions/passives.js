const { SURPASSING_VALUE } = require("../../constants");

module.exports = {
	accuratePassive: ["Passive", "Gain @{critRate} Crit Rate"],
	organicPassive: ["Passive", "This gear regains 1 durability when entering a new room"],
	surpassingPassive: ["Passive", `Increase your damage cap by ${SURPASSING_VALUE}`],
	swiftPassive: ["Passive", "Gain @{speed} Speed"]
};

const { SURPASSING_VALUE } = require("../../constants");

module.exports = {
	accuratePassive: ["Passive", "Gain @{critRate} Crit Rate"],
	surpassingPassive: ["Passive", `Increase your damage cap by ${SURPASSING_VALUE}`],
	swiftPassive: ["Passive", "Gain @{speed} Speed"]
};

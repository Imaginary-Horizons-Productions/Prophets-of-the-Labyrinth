const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, removeModifier, changeStagger } = require("../util/combatantUtil.js");
const { isBuff } = require("../modifiers/_modifierDictionary");
const { selectRandomFoe, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { getEmoji } = require("../util/elementUtil.js");

const asteroid = require("./asteroid.js")

const PATTERN = {
  "Call Asteroid": "Tremor Smash",
  "Damping Wallop": "random",
  "Tremor Smash": "random"
}
function earthlyKnightPattern(actionName) {
  return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Earthly Knight",
  "Earth",
  250,
  100,
  "6",
  0,
  "Tremor Smash",
  false
).addAction({
  name: "Damping Wallop",
  element: "Earth",
  description: `Inflict ${getEmoji("Earth")} damage and remove a buff`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower() + 75;
    changeStagger(targets, "elementMatchFoe");
    let resultString = ""
    for (const target of targets) {
      resultString += dealDamage([target], user, damage, false, user.element, adventure);
      const targetBuffs = Object.keys(target.modifiers).filter(modifier => isBuff(modifier));
      console.log(targetBuffs);
      const buffIndex = adventure.generateRandomNumber(targetBuffs.length, "battle");
      const rolledDebuff = targetBuffs[buffIndex];
      const wasRemoved = removeModifier([target], { name: rolledDebuff, stacks: "all" }).length > 0;
      if (wasRemoved) {
        resultString += `${rolledDebuff} was lost.`;
      }
    }
    return resultString;
  },
  selector: selectRandomFoe,
  needsLivingTargets: true,
  next: earthlyKnightPattern
}).addAction({
  name: "Tremor Smash",
  element: "Earth",
  description: `Deal minor ${getEmoji("Earth")} to all foes and stagger them`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower();
    if (isCrit) {
      damage *= 2;
    }
    changeStagger(targets, 3);
    return dealDamage(targets, user, damage, false, user.element, adventure);
  },
  selector: selectAllFoes,
  needsLivingTargets: true,
  next: earthlyKnightPattern
}).addAction({
  name: "Call Asteroid",
  element: "Untyped",
  description: "Summon an Asteroid",
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    spawnEnemy(asteroid, adventure);
    return "An Asteroid arrives on the battlefield.";
  },
  selector: selectNone,
  needsLivingTargets: false,
  next: earthlyKnightPattern
});

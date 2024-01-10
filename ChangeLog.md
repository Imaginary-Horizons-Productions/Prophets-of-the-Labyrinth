# Prophets of the Labyrinth Change Log
## Prophets of the Labyrinth v0.14.0:
This update has a systems focus: making damage midigation less situation by having Block (now protection) expire at end of combat instead of end of turn and adding a reward for the risk of combat via combat levels. There's also new content such as: adding more AoE with the Blasting gear variant and a few new artifacts.
### Combat Levels
- Delvers now levelup after combat, increasing their stats (1 level for normal battles, 3 levels for artifact guardians, 5 levels for final bosses)
### Block Rework
- renamed to "protection"
- expires at end of combat instead of end of turn
- Vigilance now applies to Evade instead of protection
### Gear
- New Gear: Wise Chainmail, Prismatic Blast, Vexing Prismatic Blast
- Barriers now provide 3 Evade instead of 999 Block
### Artifacts
- New Artifact: Manual Manual
- Crystal Shard (artifact) now increases range of Spells--durability saving effect is now on the new Weapon Polish artifact, which applies to Weapons
### Other Changes
- Combined event rooms "Elemental Research" and "HP Redistribution" into "Imp Contract Faire"
- New Archetype: Fighter - No predict or extra effects on gear, double stat growths
## Prophets of the Labyrinth v0.13.0:
- New Gear: Refreshing Breeze, Shattering Sabotage Kit, Harmful Corrosion, Shattering Corrosion, Wolf Ring, Surpassing Wolf Ring, Swift Wolf Ring, Harmful Poison Torrent, Ice Bolt, Scarf, Hearty Scarf, Chainmail
- Reworked Thick Cloak to Accurate Cloak
- Combined Barrier and Vigilance Charm
- New Artifacts: Celestial Knight Insignia, Boat Parts
- Bloodshield Sword (artifact) reworked into Health Insurance Loophole, now grants gold instead of block
- Doubled poise and added stagger, left per round fall-off and matching element stagger cure at 1
- Combatant stagger can no longer be modified while the combatant is stunned
- The Piercing gear variant is now Unstoppable; it is now also usable while Stunned
- Players now need to select their moves when Stunned (for Unstoppable)
- New Debuff: Frail - Deals damage when the bearer is Stunned
- Iron Fist Stance crits now apply Frail to all enemies instead of granting the user Power Up
- New Debuff: Paralysis - Stagger increases instead of falling off between rounds
- Some enemies's poise now scales with party size
- New Challenge: Unlabelled Placebos - Items have a chance to do nothing
- Tweaked room rarities, largely to make Battles and Events more common
- New Item: Panacea - Cures up to 2 debuffs on the user
- New Enemy: Mechabee Soldier
- Buffed Elkemist ||Toil removes a random debuff, Bubble converts buffs to Fire Weakness, Progress no longer grants Stasis||
- Forges are now Workshops: They now always offer repairs and upgrades. They will randomly offer one of the following: changing gear upgrades, increasing party gear capacity, or trading for an unknown upgraded gear.
- Gear that applies Stagger now accounts for Same Element Stagger Bonus in their descriptions
- New Command: `/manual enemy-info`
## Prophets of the Labyrinth v0.12.0:
- Reintroduced Light and Darkness elements
- Reworked Martial Artist starting gear
   - Iron Fist Stance: increases Punch damage and changes it to your element
   - Floating Mist Stance: grants Evade each turn and increases Punch inflicted by Stagger
- Renamed several entities:
   - Equipment to Gear
   - Consumables to Items
   - Stagger Threshold to Poise
   - \[Equipment's\] Uses to Durability
- New Gear: Iron Fist Stance, Organic Iron Fist Stance, Floating Mist Stance, Soothing Floating Mist Stance, Reactive Warhammer, Discounted Infinite Regneration, Discounted Midas Staff, Poison Torrent, Power from Wrath, Morning Star
- Fixed combat bugs caused by a target dying mid-round (particularly with Clones)
- Fix many incorrect price bugs (and similar "typo'd when entering data" bugs)
- Added `/regenerate` command, which resends the current room's message and UI
- Ritualist's target selection helper text now shows if the target has debuffs or not
- Buffed gear durability across the board by 50% or more (except Toxic Sickle, which had more durability than its peers)
- Tweaked room rarities, largely made Treasure rooms Rarer (buffed contents of Treasure rooms)
- Treasure rooms now have a random 2 of the following four options (players can still only pick one):
   - an artifact
   - 1 of 2 pieces of gear
   - a large sum of gold
   - a pair of items
- Reworked Block variants
   - Heavy - decomposed into the following
   - Guarding - adds Block to its target
   - Reinforced - adds Block to the user
- Combined `/armory` and `/conumable-info` into `/manual` using subcommands
- Combinde `/inspect-self` and `/party-stats` into `/adventure` using subcommands
- Added Detective archetype
- New players will now start with 3 random archetypes, if you'd like to test another archetype, contact a developer!
- Buffed Absorb potions to 3 stacks from 1
- Reduced Bloodtail Hawk's Rake damage from 50 to 45
- Reduced base crit chance to 1/5
- Hawk Tailfeather and Negative-One Leaf Clover now offer rerolls on fails
- Score for gold, lives, depth, and bonus update live; added score to `/adventure party-stats`

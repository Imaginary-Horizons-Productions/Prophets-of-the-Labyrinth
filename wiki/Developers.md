Welcome prospective developers! We're so glad you've interested in helping out.

## Local Setup Instructions
1. Clone the repo
2. Setup your discord bot
3. Run `npm run initialize` from root
4. Populate the newly created `/config/auth.json`
5. Run `npm start:dev` from root to start the app

## Procedure
- Stories start as Discussions, where they are developed until they achieve Story Completion
- Restricting creating Issues until Story Completion (aka Story Approval) is intended to allow developers to confidently asynchronously select work on any Issue knowing that
   - The Issue is not a duplicate
   - The Issue's requirements are defined enough to complete the Story
   - The Issue is unlikely to be in conflict with other work
- When a Discussion achieves Story Completion, it is promoted to an Issue and the corresponding Discussion is deleted
- Issues may futher be grouped into Milestones, which represent the minimum Issues required to release the next version
- Issues not grouped into a Milestone can be added to any Milestone upon completion
- Each Issue should have its own Feature Branch
- When work on an Issue is complete, a Pull Request is opened to the relevant release branch (`main` is live)
- Pull Requests are to require `log10(active developers)` reviews
- Feature Branches are to be deleted after their Pull Requests are merged or rejected

## Style
- This project uses tabs for indentation to reduce file size and keypresses during code navigation
- Bot feedback messages should be written in 3rd-person passive tense (to avoid unnecesary personification) and make requests in polite language
    - Example: "Your bounty could not be posted. Please remove phrases disallowed by the server from the title and try again."
- In User Facing text, use percentages instead of `÷` or `/` and `x` instead of `*` because the approved operator symbols have greater wide-spread understanding

### File and Directory Naming Convention
Please use `camelCase` unless one of the following exceptions apply:
- Classes are in `PascalCase` as programming convention
- Interaction instances match their customIds
   - Slash commands use `kebab-case` as part of Discord convention
   - Context menu commands have their customIds visible to the end user as the menu option name, and we use `Proper Noun Case` as a result
     - File names should match the customIds, but use underscores instead of spaces (like `Proper_Noun_Case.js`)
   - Others avoid a delimiter character, making them `alllowercase`, as we sometimes concatenate arguments to interaction customIds, which have a max length
- Emoji image file names match the display name of their entity with white space replaced by underscore (eg `Curse_of_Midas.png`)

### Game Mechanic Names
- Modifier names should be nouns to be grammatically correct with result texts and include proper nouns for game specific modifiers (eg "Evasion" instead of "Evade", "Poison" instead of "Poisoned")

### Message Components
- Button and Select option labels should follow the pattern `(emoji) name [cost: effect]`
- Button styles should be picked based on behavior:
   - Primary: Casts a vote among the party
   - Secondary: Provides more information without committing resources
   - Success: Progress action that commits resources
   - Danger: Risky action that commits resources
- Buttons that trigger effects that consume room actions should have the number emoji of the number of room actions consumed as their emoji
- Select Menus that trigger effects that consume room actions should have the number emoji of the number of room actions consumed at the beginning of their placeholder
- Add 💬 to the beginning of the placeholder of Select Menus that send a confirmation message/button before changing state

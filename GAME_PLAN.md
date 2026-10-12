# The Lantern & Ladle — Game Outline

## High concept

A cozy, character-driven mobile tavern management game. You play the keeper of a small roadside inn at the edge of a dangerous, magical frontier. By day and evening you prepare drinks and simple meals, serve a changing mix of travelers, and keep the tavern running. Between shifts you improve the inn, learn what is happening in the region, and decide which customers and opportunities to invest in.

The tone is warm and lightly humorous, with occasional mystery and danger. The world should be an original fantasy setting that takes broad inspiration from tabletop fantasy and classic epic fantasy. Do not use Dungeons & Dragons, Lord of the Rings, or other existing franchises' names, characters, settings, creatures, text, or distinctive designs.

## Player promise

“A busy shift, a memorable guest, and one more reason to open the doors tomorrow.”

## Visual style and presentation

- Cozy, cartoonish 2D art with a soft painterly finish, candlelit amber colors, and expressive guest reactions.
- Use a landscape tavern-counter composition: the guest sits centrally behind the bar, their order appears above and to the right, preparation stations fill the foreground, and ingredient choices sit along the bottom.
- The customer is the visible character; the player is never represented by a bartender, hands, or a first-person avatar.
- Keep the tavern view during preparation. Show actions through animated objects in the foreground stations: a knife cuts ingredients, potion bubbles stir in the cauldron, and steam rises from a finished dish.
- Keep touch targets large and order feedback clear on a phone held sideways.

## Target and format

- **Platform:** iOS and Android phones; tablets can be supported later.
- **View:** 2D, landscape orientation, designed for touch play with a wide tavern counter scene.
- **Session length:** A shift should take about 3–7 minutes; a full in-game day about 8–15 minutes.
- **Mode:** Single-player. The first version should work offline and avoid accounts, ads, and online services.
- **Prototype technology:** A standalone HTML/CSS/JavaScript browser prototype for easy sharing and phone testing; it does not require an engine install.
- **Production engine:** Still to be chosen after the prototype loop feels right. Godot remains a practical option for a 2D mobile release.

## Setting and story frame

The **Lantern & Ladle** stands where the old king's road meets the Bramble March. The previous keeper has left, the roof leaks, and the regulars have stopped trusting one another. Your job is to keep the doors open and make the inn a place people want to return to.

Guests bring small, self-contained stories: a courier with a sealed parcel, a hedge-mage short on coin, a pair of rival scouts, a homesick stoneworker, or a knight who would rather not discuss the battle. Their requests and relationships can reveal the wider local story without requiring a sprawling campaign.

## Core gameplay loop

1. **Prepare:** Choose a small menu from unlocked recipes and check stock.
2. **Open the doors:** Guests arrive with preferences, patience, budgets, and occasional special requests.
3. **Read and serve:** Select the right drink or meal, prepare it through close-up ingredient and utensil animations, and serve before patience runs out.
4. **Resolve the shift:** Earn coin and reputation, spend ingredients, and receive guest reactions or story beats.
5. **Make a choice:** Restock, upgrade, learn a recipe, or follow up on a guest's request.
6. **Welcome familiar faces:** Returning guests remember prior choices and unlock new conversations and requests.

## Feature list

### Core features for the first playable version

- Touch-first serving flow with clear guest order bubbles, readable timers, and expressive customer reactions.
- A compact roster of guests with distinct portraits, preferences, patience, and reactions.
- A starter menu of roughly 5 drinks and 3 simple foods.
- A short preparation interaction that shows ingredients and tools moving on their own, with no visible player avatar or hands.
- Drink actions such as selecting ingredients, pouring a measured amount, mixing, garnishing, and serving; food actions such as slicing, assembling, cooking, and plating.
- Strong visual feedback during preparation and a memorable guest reaction after serving, whether the result delights, surprises, or disappoints.
- Shift goals, coin, ingredient stock, and a simple reputation meter.
- End-of-shift summary explaining earnings, costs, guest satisfaction, and progress.
- A small tavern upgrade path with visible changes to the room.
- Save/load for local progress.
- Accessibility basics: scalable text, color-independent status indicators, reduced motion option, and adjustable sound/music levels.

### Features to consider after the first playable version

- Guest relationship stories and branching conversation choices.
- More recipes, seasonal ingredients, regional specialties, and menu planning.
- Staff hiring and task assignment.
- A town map with suppliers and short story encounters.
- Tavern decoration and room expansion.
- Special events, festivals, and unusual visiting parties.
- Optional challenge mode or endless shifts.
- Cloud saves, localization, achievements, and platform services only if they fit the product goals.

## Progression and economy

- **Coin** pays for ingredients, repairs, and upgrades.
- **Reputation** brings more guests and unlocks better suppliers and recipes.
- **Guest trust** advances individual storylines and can unlock unique rewards.
- Keep the early economy forgiving: a poor shift should slow progress, not create a fail state or force a grind.
- Avoid energy timers, paid random rewards, and pressure to make purchases. The first release can be a premium game or a free prototype while the business model is decided.

## Art and audio direction

- Painted 2D backgrounds and expressive, readable guest portraits.
- A warm palette of candle gold, wood brown, moss green, and dusk blue; strong contrast for gameplay controls.
- Original silhouettes and motifs for fantasy peoples, clothing, architecture, and symbols.
- Subtle animation: firelight, steam, pouring, door movement, and guest reactions.
- Audio should make the room feel lived-in without masking interface feedback: low tavern ambience, gentle fantasy music, and distinct serving cues.

## Implementation todo

### Phase 0 — Decisions and foundations

- [ ] Confirm the target devices and minimum OS versions.
- [ ] Choose the production engine and establish a mobile project, landscape layout, and version control conventions.
- [ ] Decide the intended release model and whether the first milestone is a prototype, vertical slice, or production build.
- [ ] Write a one-page visual reference sheet for the original setting and character style.
- [ ] Define the first-shift scope and success criteria before adding content.

### Phase 1 — Playable serving prototype

- [ ] Build the main tavern screen with safe-area-aware landscape UI.
- [ ] Implement guest arrival, order display, patience, and departure.
- [ ] Implement recipe data and the prepare/serve interaction.
- [ ] Build the preparation view around animated ingredients, vessels, and tools; keep the player character off-screen.
- [ ] Prototype one drink sequence (choose ingredients → pour/mix → serve) and one food sequence (cut/prepare → plate → serve).
- [ ] Add ingredient inventory, coin rewards, and guest satisfaction.
- [ ] Add shift start, shift end, and a results screen.
- [ ] Add placeholder art/audio so the loop can be tested before final assets exist.
- [ ] Tune touch target sizes, pacing, readability, and performance on a real phone.

### Phase 2 — Progression and content slice

- [ ] Add local save/load and a basic settings screen.
- [ ] Add a small supplier/restock flow and a few tavern upgrades.
- [ ] Add several guest archetypes and returning-guest state.
- [ ] Add a short opening story and at least one complete guest storyline.
- [ ] Add onboarding that teaches one action at a time during the first shift.
- [ ] Replace placeholders with a consistent, original art and audio set.

### Phase 3 — Polish and release preparation

- [ ] Add accessibility settings and verify the UI at supported phone sizes.
- [ ] Balance shift length, recipe difficulty, stock costs, and progression.
- [ ] Profile memory, loading, battery use, and frame rate on representative devices.
- [ ] Prepare store descriptions, screenshots, icon, privacy disclosures, and platform builds.
- [ ] Run device testing and fix launch-blocking issues before release.

## Assets to provide or commission

The first prototype now uses the supplied tavern background, guest portrait, and ingredient/order icons in `assets/`. New art is not required for this prototype.

- **Music:** `assets/music/Ale and Anecdotes.mp3` now plays as a quiet loop after the first interaction. Keep its source/license details with the project and verify attribution and distribution terms before release.
- **Sound effects:** Supplied clips in `assets/sounds/` are connected to ingredient selection, preparation, serving, coin rewards, and new orders. Some are intentionally clipped to short opening segments for the prototype.
- **Art:** The prototype uses the supplied background, elven guest portrait, and PNG icons. Later, the game will need more original guest portraits, ingredient and dish icons, and a small set of animated effects. Keep the source/license details for any assets used in a release.

## Reference research: *Bartender: The Right Mix*

The game is a useful reference for the simple, tactile mixing loop: choose bottles/ingredients, control pouring, mix or shake, then serve and watch the result. Its appeal also comes from the reveal after serving, where the drink gets a reaction. Our version can use that readable sequence while making the preparation animation about ingredients, tools, and the vessel, and making the guest the visible reaction character. These are design observations, not a request to copy its assets, characters, interface, recipes, or presentation.

Sources consulted: [CrazyGames game page](https://www.crazygames.com/game/bartender-the-right-mix) and [Kongregate game page](https://www.kongregate.com/en/games/mattsackblack/bartender-the-right-mix).

## Open design questions

- Should the experience lean more toward **cozy story game** or **fast, skill-based serving**?
- Should preparation be a short real-time minigame, a simple recipe selection, or a mix of both?
- What is the intended release model: paid, free prototype, or undecided?
- Which engine do you prefer, if any? Godot is a practical starting recommendation for a small 2D mobile game.

## Prototype status

The browser prototype is implemented in `index.html`, `style.css`, and `game.js`. It uses the supplied landscape tavern background, four randomly rotating customer portraits, ingredient icons, music, and sound effects. The loop covers ingredient selection, preparation, serving, a guest reaction, coin rewards, and three sample orders. See `README.md` for how to play it.

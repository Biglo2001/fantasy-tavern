const guests = [
  {
    name: "Mira Fernwhistle", kind: "drink", order: "Bramble Fizz", description: "Bright, bubbly & a little sweet",
    quote: "A little sparkle, if you please!", skin: "#e9b995", hair: "#6f5745", clothes: "#728a69", mouth: "⌣", vessel: "🥛", tool: "YOUR GLASS",
    ingredients: ["Sunberry", "Springwater", "Honey"], actions: ["pour", "stir"],
    pool: [["Sunberry", "🍓"], ["Springwater", "💧"], ["Honey", "🍯"], ["Bog pepper", "🌶️"], ["Moonmint", "🌿"]],
    reaction: "Fizzing with just the right kind of magic!"
  },
  {
    name: "Borin Underbough", kind: "food", order: "Hearthroot Stew", description: "A hearty bowl for the road",
    quote: "Something warm enough to thaw my boots.", skin: "#bd8060", hair: "#493a32", clothes: "#9b674c", mouth: "⌣", vessel: "🥣", tool: "YOUR CAULDRON",
    ingredients: ["Potato", "Carrot", "Mushroom"], actions: ["slice", "simmer"],
    pool: [["Potato", "🥔"], ["Carrot", "🥕"], ["Mushroom", "🍄"], ["Red apple", "🍎"], ["Thyme", "🌿"]],
    reaction: "Now that tastes like coming home."
  },
  {
    name: "Puck Ashbell", kind: "drink", order: "Moonmilk Cocoa", description: "A cozy nightcap, not too hot",
    quote: "The stars are out. Cocoa should be too.", skin: "#efc89e", hair: "#8c5e3e", clothes: "#8a7891", mouth: "⌣", vessel: "☕", tool: "YOUR CUP",
    ingredients: ["Moonmilk", "Cocoa", "Cinnamon"], actions: ["pour", "warm"],
    pool: [["Moonmilk", "🥛"], ["Cocoa", "🍫"], ["Cinnamon", "🪵"], ["Cloudberry", "🫐"], ["Stardust", "✨"]],
    reaction: "Mmm. A perfect little bit of bedtime."
  }
];

const actionCopy = {
  pour: { label: "Pour the ingredients", icon: "↘", instruction: "Watch the colors tumble into your glass.", status: "Ready for a careful pour" },
  stir: { label: "Stir it together", icon: "⟳", instruction: "Give it a gentle stir to wake up the sparkle.", status: "A little swirl brings it to life" },
  slice: { label: "Slice everything", icon: "⌁", instruction: "A few neat slices, then into the pot.", status: "Knife at the ready" },
  simmer: { label: "Let it simmer", icon: "♨", instruction: "Let the good smells fill the room.", status: "Low and slow is the secret" },
  warm: { label: "Warm it gently", icon: "♨", instruction: "Just warm enough for a chilly evening.", status: "A cozy warmth is rising" }
};

const $ = (id) => document.getElementById(id);
const state = { guestIndex: 0, coins: 12, goodwill: 0, selected: [], actionIndex: 0, patience: 100, shiftStarted: false, serving: false, toastTimer: null, patienceTimer: null };
const actionButton = $("action-button");

function currentGuest() { return guests[state.guestIndex]; }
function setText(id, value) { $(id).textContent = value; }

function renderGuest() {
  const guest = currentGuest();
  if (!guest) return;
  setText("guest-name", guest.name);
  setText("guest-caption", `“${guest.quote}”`);
  setText("order-name", guest.order);
  setText("order-description", guest.description);
  setText("order-stamp", guest.kind === "food" ? "FROM THE KITCHEN" : "DRINK");
  setText("tool-label", guest.tool);
  setText("vessel-emoji", guest.vessel);
  $("guest-hair").style.background = guest.hair;
  $("guest-body").style.background = guest.clothes;
  $("guest-portrait").querySelector(".guest-face").style.background = guest.skin;
  $("guest-mouth").textContent = guest.mouth;
  $("order-recipe").innerHTML = guest.ingredients.map(name => `<span class="recipe-tag">${name}</span>`).join("");
  $("reaction-bubble").hidden = true;
  $("guest-portrait").className = "guest-portrait";
  $("mood-dot").style.background = "#82a16f";
  setText("shift-label", state.guestIndex === 0 ? "FIRST SHIFT" : "EVENING RUSH");
  setText("progress-copy", `GUEST ${state.guestIndex + 1} OF ${guests.length}`);
  $("progress-fill").style.width = `${(state.guestIndex / guests.length) * 100}%`;
  state.patience = 100;
  updatePatience();
  renderPrep();
}

function renderPrep() {
  const guest = currentGuest();
  if (!guest) return;
  const finishedIngredients = state.selected.length >= guest.ingredients.length;
  const finishedActions = state.actionIndex >= guest.actions.length;
  const readyToServe = finishedIngredients && finishedActions;
  const activeAction = guest.actions[state.actionIndex];

  if (!finishedIngredients) {
    setText("prep-eyebrow", "YOUR COUNTER");
    setText("prep-title", `Make the ${guest.order}`);
    setText("step-pill", `STEP 1 / ${guest.actions.length + 1}`);
    setText("mix-status", "✧  Choose the ingredients");
    setText("step-instruction", "Tap the ingredients your guest asked for.");
    setText("ingredient-label", "PICK YOUR INGREDIENTS");
    setText("action-label", "Continue to prep");
    setText("action-icon", "✧");
    setText("micro-hint", "No hands in sight. Just good ingredients and a little tavern magic.");
    actionButton.disabled = true;
    actionButton.classList.add("button-disabled");
  } else if (!finishedActions) {
    const copy = actionCopy[activeAction];
    setText("prep-eyebrow", guest.kind === "food" ? "A LITTLE KITCHEN MAGIC" : "A LITTLE TAVERN MAGIC");
    setText("prep-title", activeAction === "slice" ? "Chop, chop!" : activeAction === "simmer" ? "Let the pot sing" : `Time to ${activeAction}`);
    setText("step-pill", `STEP ${state.actionIndex + 2} / ${guest.actions.length + 1}`);
    setText("mix-status", `✧  ${copy.status}`);
    setText("step-instruction", copy.instruction);
    setText("ingredient-label", "IN THE VESSEL");
    setText("action-label", copy.label);
    setText("action-icon", copy.icon);
    setText("micro-hint", "The ingredients do the dancing. You just give them a nudge.");
    actionButton.disabled = false;
    actionButton.classList.remove("button-disabled");
  } else {
    setText("prep-eyebrow", "READY TO SERVE");
    setText("prep-title", "One for the road!");
    setText("step-pill", "ALL DONE");
    setText("mix-status", "✧  That looks lovely");
    setText("step-instruction", "Your guest is waiting for the first taste.");
    setText("ingredient-label", "A LITTLE SOMETHING MADE WITH CARE");
    setText("action-label", "Serve to " + guest.name.split(" ")[0]);
    setText("action-icon", "♡");
    setText("micro-hint", "Tap serve and see what they think.");
    actionButton.disabled = false;
    actionButton.classList.remove("button-disabled");
  }

  const grid = $("ingredient-grid");
  grid.replaceChildren();
  guest.pool.forEach(([name, emoji]) => {
    const selected = state.selected.includes(name);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ingredient-button${selected ? " selected" : ""}`;
    button.disabled = finishedIngredients || selected || state.serving;
    button.setAttribute("aria-pressed", String(selected));
    button.innerHTML = `<span class="ingredient-emoji">${emoji}</span><span class="ingredient-name">${name}</span>${selected ? '<span class="check">✓</span>' : ""}`;
    button.addEventListener("click", () => addIngredient(name, emoji));
    grid.append(button);
  });
  $("ingredient-count").textContent = `${state.selected.length} of ${guest.ingredients.length} added`;
  $("added-ingredients").innerHTML = state.selected.map(name => {
    const item = guest.pool.find(([ingredient]) => ingredient === name);
    return `<span class="added-chip">${item ? item[1] : "✧"} ${name}</span>`;
  }).join("");
  updateVessel(guest);
  setText("coin-count", state.coins);
  setText("rep-count", state.goodwill);
}

function updateVessel(guest) {
  const liquid = $("liquid");
  liquid.style.height = `${Math.min(84, 20 + state.selected.length * 18)}%`;
  const colors = guest.kind === "food" ? ["#b5a04c", "#a58045", "#8a7545"] : ["#d9b44b", "#c98e68", "#9077aa"];
  liquid.style.background = colors[Math.min(state.actionIndex, colors.length - 1)];
  if (state.actionIndex > 0) $("vessel").style.transform = "rotate(-3deg)";
  else $("vessel").style.transform = "";
}

function addIngredient(name, emoji) {
  if (state.selected.length >= currentGuest().ingredients.length || state.selected.includes(name)) return;
  state.selected.push(name);
  const spill = !currentGuest().ingredients.includes(name);
  renderPrep();
  if (spill) showToast("A curious choice! The guest may notice.");
  else showToast(`${emoji} ${name} added`);
}

function handleAction() {
  if (state.serving) return;
  const guest = currentGuest();
  if (state.selected.length < guest.ingredients.length) {
    showToast("Choose the ingredients first.");
    return;
  }
  if (state.actionIndex < guest.actions.length) {
    const action = guest.actions[state.actionIndex];
    state.actionIndex += 1;
    const vessel = $("vessel");
    vessel.classList.remove("pouring", "stirring", "chopping", "warming");
    void vessel.offsetWidth;
    vessel.classList.add(({ pour: "pouring", stir: "stirring", slice: "chopping", simmer: "warming", warm: "warming" })[action]);
    if (action === "slice") {
      $("mixing-board").classList.add("slice-effect");
      setTimeout(() => $("mixing-board").classList.remove("slice-effect"), 700);
    }
    if (action === "simmer" || action === "warm") {
      $("mixing-board").classList.add("steam-effect");
      setTimeout(() => $("mixing-board").classList.remove("steam-effect"), 900);
    }
    renderPrep();
    if (state.actionIndex === guest.actions.length) showToast("Lovely. Ready to serve!");
    return;
  }
  serveGuest();
}

function serveGuest() {
  const guest = currentGuest();
  const matching = state.selected.filter(name => guest.ingredients.includes(name)).length;
  const wrong = state.selected.length - matching;
  const perfect = matching === guest.ingredients.length && wrong === 0;
  const patienceBonus = Math.round(state.patience / 35);
  const earned = Math.max(1, 2 + matching + (perfect ? 2 : 0) + patienceBonus - wrong * 2);
  state.coins += earned;
  if (perfect) state.goodwill += 1;
  state.serving = true;
  state.guestIndex += 1;
  const portrait = $("guest-portrait");
  portrait.classList.add(perfect ? "happy" : matching >= 2 ? "surprised" : "sad");
  $("mood-dot").style.background = perfect ? "#82a16f" : matching >= 2 ? "#dfa960" : "#d8816f";
  $("reaction-bubble").hidden = false;
  $("reaction-bubble").textContent = perfect ? guest.reaction : matching >= 2 ? "Not quite what I pictured, but quite the surprise!" : "Oh dear. Perhaps next time, then.";
  $("progress-fill").style.width = `${(state.guestIndex / guests.length) * 100}%`;
  setText("progress-copy", state.guestIndex === guests.length ? "SHIFT COMPLETE" : `GUEST ${state.guestIndex} OF ${guests.length}`);
  setText("coin-count", state.coins);
  setText("rep-count", state.goodwill);
  setText("micro-hint", perfect ? `A perfect order! +${earned} coin${earned === 1 ? "" : "s"} and a little goodwill.` : `+${earned} coin${earned === 1 ? "" : "s"}. A good effort, even if the recipe wandered.`);
  actionButton.disabled = true;
  actionButton.classList.add("button-disabled");
  $("clear-button").textContent = state.guestIndex === guests.length ? "Finish shift" : "Next guest →";
  $("clear-button").classList.add("next-button");
  showToast(perfect ? `Perfect! +${earned} coin · +1 goodwill` : `Served with care · +${earned} coin`);
}

function nextGuest() {
  if (!state.serving) {
    state.selected = [];
    state.actionIndex = 0;
    renderPrep();
    showToast("Ingredients cleared. Fresh start!");
    return;
  }
  state.serving = false;
  $("clear-button").textContent = "Start over";
  $("clear-button").classList.remove("next-button");
  if (state.guestIndex >= guests.length) {
    finishShift();
    return;
  }
  state.selected = [];
  state.actionIndex = 0;
  renderGuest();
}

function finishShift() {
  clearInterval(state.patienceTimer);
  const modal = $("welcome-modal");
  modal.innerHTML = `<div class="modal-sparkle">☼</div><p class="eyebrow">THE LAST MUG IS WASHED</p><h2 id="welcome-title">What a lovely evening.</h2><p class="welcome-copy">Three travelers found a little warmth at your door. The Bramble March feels a little more like home tonight.</p><div class="welcome-facts"><span>✦ &nbsp;${state.coins} coin in the till</span><span>♥ &nbsp;${state.goodwill} guests left smiling</span><span>☾ &nbsp;The lantern will shine again tomorrow</span></div><button class="primary-button welcome-button" id="start-button" type="button"><span>Pour another evening</span><span class="button-arrow">→</span></button><small>END OF FIRST SHIFT · PROTOTYPE</small>`;
  $("start-button").addEventListener("click", resetShift);
  $("modal-backdrop").classList.remove("hidden");
}

function resetShift() {
  state.guestIndex = 0;
  state.coins = 12;
  state.goodwill = 0;
  state.selected = [];
  state.actionIndex = 0;
  state.patience = 100;
  state.serving = false;
  $("clear-button").textContent = "Start over";
  $("clear-button").classList.remove("next-button");
  $("modal-backdrop").classList.add("hidden");
  renderGuest();
  state.patienceTimer = setInterval(tickPatience, 2500);
}

function tickPatience() {
  if (state.serving || !state.shiftStarted) return;
  state.patience = Math.max(0, state.patience - 2);
  updatePatience();
}
function updatePatience() {
  $("patience-fill").style.width = `${state.patience}%`;
  $("patience-fill").style.background = state.patience > 45 ? "#e2aa62" : state.patience > 20 ? "#df8d62" : "#d36e66";
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("visible"), 1700);
}

actionButton.addEventListener("click", handleAction);
$("clear-button").addEventListener("click", nextGuest);
$("start-button").addEventListener("click", () => {
  state.shiftStarted = true;
  $("modal-backdrop").classList.add("hidden");
  renderGuest();
  state.patienceTimer = setInterval(tickPatience, 2500);
});
$("sound-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const isMuted = button.textContent.trim() === "♫";
  button.textContent = isMuted ? "♪" : "♫";
  button.title = isMuted ? "Sound muted" : "Toggle sound";
  showToast(isMuted ? "Sound is off in this prototype." : "Sound is on (audio coming later). ");
});

renderGuest();

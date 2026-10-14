const iconRoot = "assets/icons/";
const ingredients = [
  { id: "potion", label: "Red tonic", icon: "potion_icon_03.png" },
  { id: "lemon", label: "Sun lemon", icon: "lemon_icon_04.png" },
  { id: "herbs", label: "Wild herbs", icon: "herbs_icon_05.png" },
  { id: "mushroom", label: "Mooncap", icon: "mushroom_icon_06.png" },
  { id: "meat", label: "Smoked meat", icon: "meat_icon_07.png" }
];

const orders = [
  {
    title: "Red tonic & forest stew", shortTitle: "Tonic & forest stew",
    outputs: ["potion_icon_03.png", "stew_icon_0.png"],
    needs: ["potion", "herbs", "mushroom", "meat"],
    perfect: "A tonic with a lovely woodland warmth!", good: "Just the thing for a long road ahead.", poor: "A curious blend. Perhaps the next one will be just right."
  },
  {
    title: "Mooncap hearth stew", shortTitle: "Mooncap stew",
    outputs: ["stew_icon_0.png"],
    needs: ["herbs", "mushroom", "meat"],
    perfect: "Rich, earthy, and perfectly seasoned!", good: "A hearty bowl for a chilly evening.", poor: "A little unusual, but thank you for the effort."
  },
  {
    title: "Sun lemon tonic", shortTitle: "Lemon tonic",
    outputs: ["potion_icon_03.png"],
    needs: ["potion", "lemon", "herbs"],
    perfect: "Bright as a summer morning!", good: "A refreshing little bit of alchemy.", poor: "A surprising taste. I may need a moment."
  }
];

const customers = [
  { name: "Elowen", description: "an elven regular", image: "customer_elven_woman_happy.png", alt: "A cheerful elven tavern guest" },
  { name: "Pip", description: "a goblin tinkerer", image: "customer_goblin_happy.png", alt: "A cheerful goblin tavern guest" },
  { name: "Rowan", description: "a human traveler", image: "customer_human_happy.png", alt: "A friendly human tavern guest" },
  { name: "Brakka", description: "an orc adventurer", image: "customer_orc_sad.png", alt: "A smiling orc tavern guest" },
  { name: "Mittens", description: "a curious catfolk", image: "customer_cat_happy.png", alt: "A cheerful catfolk tavern guest" }
];

const $ = (id) => document.getElementById(id);
const state = { orderIndex: 0, customer: null, selected: [], phase: "choose", coins: 23, day: 3, served: 0, timer: null, feedbackTimer: null, muted: false, musicStarted: false };
const audioBase = new URL("assets/sounds/", document.baseURI);
const music = new Audio(new URL("assets/music/Ale and Anecdotes.mp3", document.baseURI));
music.loop = true;
music.volume = 0.24;
music.preload = "auto";
const soundFiles = {
  plate: "freesound_community-ceramic-plate-set-down-71330.mp3",
  pour: "freesound_community-quick-pour-86306.mp3",
  chair: "freesound_community-wooden-chair-push-in-pull-outwav-14414.mp3",
  cut: "jarasnat-cut-vegetables-and-fruits-version-2-312125.mp3",
  chop: "freesound_community-cutting-board-chops-scrapes-61998.mp3",
  stir: "freesound_community-stirring-bowl-63259.mp3",
  coin: "universfield-spinning-coin-on-table-352448.mp3",
  menu: "freesound_community-menu-selection-102220.mp3"
};
const activeEffects = new Set();

function startMusic() {
  if (state.muted || state.musicStarted) return;
  state.musicStarted = true;
  music.play().catch(() => { state.musicStarted = false; });
}

function playSound(key, clipSeconds = null, delayMs = 0) {
  if (state.muted) return;
  const play = () => {
    if (state.muted) return;
    const sound = new Audio(new URL(soundFiles[key], audioBase));
    sound.preload = "auto";
    sound.volume = 0.62;
    const stopClip = () => {
      if (clipSeconds !== null && !sound.paused) {
        sound.pause();
        sound.currentTime = 0;
      }
      activeEffects.delete(sound);
    };
    let stopTimer;
    sound.addEventListener("ended", () => { clearTimeout(stopTimer); activeEffects.delete(sound); }, { once: true });
    activeEffects.add(sound);
    sound.play().then(() => {
      if (clipSeconds !== null) stopTimer = setTimeout(stopClip, clipSeconds * 1000);
    }).catch(() => activeEffects.delete(sound));
  };
  if (delayMs > 0) setTimeout(play, delayMs);
  else play();
}

function currentOrder() { return orders[state.orderIndex]; }

function chooseCustomer() {
  const choices = customers.filter(customer => customer !== state.customer);
  state.customer = choices[Math.floor(Math.random() * choices.length)];
}

function renderOrder() {
  if (!state.customer) chooseCustomer();
  const order = currentOrder();
  state.selected = [];
  state.phase = "choose";
  $("customer").classList.remove("disappointed");
  $("game-stage").classList.remove("served", "is-preparing");
  $("order-caption").textContent = order.title;
  $("customer").src = `assets/${state.customer.image}`;
  $("customer").alt = state.customer.alt;
  $("guest-name").textContent = `${state.customer.name} · ${state.customer.description}`;
  $("day-label").textContent = `Day ${state.day}`;
  $("clock-label").textContent = `12:${String(34 + state.served).padStart(2, "0")}`;
  $("order-items").innerHTML = order.outputs.map((icon, index) => `${index ? '<span class="order-plus">+</span>' : ""}<img src="${iconRoot + icon}" alt="${icon.includes("potion") ? "Red tonic" : "Hearth stew"}">`).join("");
  renderHearts(2);
  renderRecipeNote(order);
  renderIngredients();
  updateAction();
  hideResult();
  setFeedback("Choose ingredients for the order");
}

function renderRecipeNote(order) {
  const note = $("recipe-note");
  note.querySelector(".note-items").innerHTML = order.outputs.map(icon => `<div><img src="${iconRoot + icon}" alt=""><span>${icon.includes("potion") ? "TONIC" : "STEW"}</span></div>`).join("");
}

function renderIngredients() {
  const order = currentOrder();
  const list = $("ingredient-list");
  list.replaceChildren();
  ingredients.forEach(item => {
    const selected = state.selected.includes(item.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `ingredient-button${selected ? " selected" : ""}`;
    button.setAttribute("aria-pressed", String(selected));
    button.setAttribute("aria-label", `${item.label}${selected ? ", selected" : ""}`);
    button.disabled = state.phase !== "choose" || (!selected && state.selected.length >= order.needs.length);
    button.innerHTML = `<img class="ingredient-icon" src="${iconRoot + item.icon}" alt=""><span class="ingredient-name">${item.label}</span>${selected ? '<span class="selected-mark">✓</span>' : ""}`;
    button.addEventListener("click", () => toggleIngredient(item.id));
    list.append(button);
  });
  $("ingredient-count").textContent = `${state.selected.length} / ${order.needs.length}`;
}

function toggleIngredient(id) {
  if (state.phase !== "choose") return;
  startMusic();
  const index = state.selected.indexOf(id);
  if (index >= 0) {
    state.selected.splice(index, 1);
    playSound("menu");
  } else if (state.selected.length < currentOrder().needs.length) {
    state.selected.push(id);
    const soundForIngredient = { potion: "pour", lemon: "cut", herbs: "chop", mushroom: "cut", meat: "cut" };
    const clipLengths = { herbs: 7, lemon: 3, mushroom: 3, meat: 3 };
    playSound(soundForIngredient[id], clipLengths[id] ?? null);
  }
  renderIngredients();
  updateAction();
  if (state.selected.length === currentOrder().needs.length) setFeedback("Lovely. Ready to prepare!");
  else setFeedback(`${state.selected.length} of ${currentOrder().needs.length} ingredients chosen`);
}

function updateAction() {
  const button = $("serve-button");
  const label = $("button-label");
  const icon = $("button-icon");
  if (state.phase === "choose") {
    button.disabled = state.selected.length !== currentOrder().needs.length;
    label.textContent = "Prepare order";
    icon.textContent = "✧";
  } else if (state.phase === "preparing") {
    button.disabled = true;
    label.textContent = "Preparing…";
    icon.textContent = "♨";
  } else if (state.phase === "ready") {
    button.disabled = false;
    label.textContent = `Serve to ${state.customer.name}`;
    icon.textContent = "♡";
  } else {
    button.disabled = true;
    label.textContent = "Order served";
    icon.textContent = "✓";
  }
}

function handleMainAction() {
  if (state.phase === "choose") prepareOrder();
  else if (state.phase === "ready") serveOrder();
}

function prepareOrder() {
  if (state.selected.length !== currentOrder().needs.length) return;
  startMusic();
  if (currentOrder().outputs.includes("stew_icon_0.png")) playSound("stir", 3);
  else playSound("menu");
  state.phase = "preparing";
  $("game-stage").classList.add("is-preparing");
  setFeedback("A little chopping, stirring, and tavern magic…");
  renderIngredients();
  updateAction();
  state.timer = setTimeout(() => {
    state.phase = "ready";
    $("game-stage").classList.remove("is-preparing");
    setFeedback(`All ready. ${state.customer.name} is waiting!`);
    renderIngredients();
    updateAction();
  }, 1150);
}

function serveOrder() {
  const order = currentOrder();
  startMusic();
  if (order.outputs.includes("stew_icon_0.png")) playSound("plate", 1);
  else playSound("menu");
  playSound("coin", 1, 1000);
  const matched = state.selected.filter(id => order.needs.includes(id)).length;
  const ratio = matched / order.needs.length;
  const hearts = ratio >= 0.999 ? 3 : ratio >= 0.66 ? 2 : ratio >= 0.33 ? 1 : 0;
  const reward = Math.max(1, 2 + matched + hearts);
  state.coins += reward;
  state.served += 1;
  state.phase = "served";
  $("coin-count").textContent = String(state.coins);
  $("game-stage").classList.add("served");
  $("customer").classList.toggle("disappointed", hearts < 2);
  renderHearts(hearts);
  renderIngredients();
  updateAction();
  $("result-title").textContent = hearts === 3 ? "A perfect pairing!" : hearts >= 2 ? "A happy little moment." : "A recipe to learn from.";
  $("result-copy").textContent = `${order[hearts === 3 ? "perfect" : hearts >= 2 ? "good" : "poor"]}  +${reward} coins`;
  $("again-button").innerHTML = state.orderIndex === orders.length - 1 ? `Serve tomorrow <span>→</span>` : `Next order <span>→</span>`;
  $("order-result").hidden = false;
  setFeedback(hearts === 3 ? `${state.customer.name} absolutely loves it!` : `${state.customer.name} takes a thoughtful sip…`);
}

function renderHearts(filled) {
  const hearts = $("hearts");
  const red = `${iconRoot}red_hearth_icon.png`;
  const grey = `${iconRoot}grey_hearth_icon.png`;
  hearts.innerHTML = Array.from({ length: 3 }, (_, index) => `<img src="${index < filled ? red : grey}" alt="">`).join("");
  hearts.setAttribute("aria-label", `${filled} out of 3 hearts`);
}

function nextOrder() {
  startMusic();
  playSound("chair", 2);
  if (state.orderIndex === orders.length - 1) {
    state.orderIndex = 0;
    state.day += 1;
    state.served = 0;
  } else state.orderIndex += 1;
  chooseCustomer();
  renderOrder();
}

function clearSelection() {
  if (state.phase !== "choose") return;
  startMusic();
  playSound("menu");
  state.selected = [];
  renderIngredients();
  updateAction();
  setFeedback("Ingredients cleared. Start fresh!");
}

function setFeedback(message) {
  $("feedback-copy").textContent = message;
  const feedback = $("work-feedback");
  feedback.classList.add("visible");
  clearTimeout(state.feedbackTimer);
  state.feedbackTimer = setTimeout(() => feedback.classList.remove("visible"), 2400);
}

function hideResult() { $("order-result").hidden = true; }

function syncFullscreenButton() {
  const fullscreen = Boolean(document.fullscreenElement);
  $("fullscreen-icon").src = `assets/icons/fullscreen_${fullscreen ? "minimize" : "expand"}_icon.png`;
  $("fullscreen-toggle").setAttribute("aria-pressed", String(fullscreen));
  $("fullscreen-toggle").setAttribute("aria-label", fullscreen ? "Exit fullscreen" : "Enter fullscreen");
  $("fullscreen-toggle").title = fullscreen ? "Exit fullscreen" : "Enter fullscreen";
}

$("fullscreen-toggle").addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.fullscreenEnabled) await $("game-screen").requestFullscreen();
    else setFeedback("Fullscreen isn't available in this browser");
  } catch {
    setFeedback("Fullscreen isn't available here");
  }
});
document.addEventListener("fullscreenchange", syncFullscreenButton);
$("serve-button").addEventListener("click", handleMainAction);
$("clear-button").addEventListener("click", clearSelection);
$("again-button").addEventListener("click", nextOrder);
$("audio-toggle").addEventListener("click", () => {
  state.muted = !state.muted;
  $("audio-icon").src = `assets/icons/volume_${state.muted ? "off" : "on"}_icon.png`;
  $("audio-toggle").setAttribute("aria-pressed", String(state.muted));
  $("audio-toggle").setAttribute("aria-label", state.muted ? "Unmute music and sound" : "Mute music and sound");
  $("audio-toggle").title = state.muted ? "Unmute music and sound" : "Mute music and sound";
  if (state.muted) {
    music.pause();
    state.musicStarted = false;
    activeEffects.forEach(sound => { sound.pause(); sound.currentTime = 0; });
    activeEffects.clear();
    playSound("menu");
  } else {
    startMusic();
    playSound("menu");
  }
});
$("coin-count").textContent = String(state.coins);
renderOrder();

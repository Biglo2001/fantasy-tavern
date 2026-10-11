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

const $ = (id) => document.getElementById(id);
const state = { orderIndex: 0, selected: [], phase: "choose", coins: 23, day: 3, served: 0, timer: null, feedbackTimer: null };

function currentOrder() { return orders[state.orderIndex]; }

function renderOrder() {
  const order = currentOrder();
  state.selected = [];
  state.phase = "choose";
  $("customer").classList.remove("disappointed");
  $("game-stage").classList.remove("served", "is-preparing");
  $("order-caption").textContent = order.title;
  $("guest-name").textContent = "Elowen · a regular";
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
  const index = state.selected.indexOf(id);
  if (index >= 0) state.selected.splice(index, 1);
  else if (state.selected.length < currentOrder().needs.length) state.selected.push(id);
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
    label.textContent = "Serve to Elowen";
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
  state.phase = "preparing";
  $("game-stage").classList.add("is-preparing");
  setFeedback("A little chopping, stirring, and tavern magic…");
  renderIngredients();
  updateAction();
  state.timer = setTimeout(() => {
    state.phase = "ready";
    $("game-stage").classList.remove("is-preparing");
    setFeedback("All ready. Elowen is waiting!");
    renderIngredients();
    updateAction();
  }, 1150);
}

function serveOrder() {
  const order = currentOrder();
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
  setFeedback(hearts === 3 ? "Elowen absolutely loves it!" : "Elowen takes a thoughtful sip…");
}

function renderHearts(filled) {
  const hearts = $("hearts");
  const red = `${iconRoot}red_hearth_icon.png`;
  const grey = `${iconRoot}grey_hearth_icon.png`;
  hearts.innerHTML = Array.from({ length: 3 }, (_, index) => `<img src="${index < filled ? red : grey}" alt="">`).join("");
  hearts.setAttribute("aria-label", `${filled} out of 3 hearts`);
}

function nextOrder() {
  if (state.orderIndex === orders.length - 1) {
    state.orderIndex = 0;
    state.day += 1;
    state.served = 0;
  } else state.orderIndex += 1;
  renderOrder();
}

function clearSelection() {
  if (state.phase !== "choose") return;
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

$("serve-button").addEventListener("click", handleMainAction);
$("clear-button").addEventListener("click", clearSelection);
$("again-button").addEventListener("click", nextOrder);
$("coin-count").textContent = String(state.coins);
renderOrder();

const { test: base, expect } = require("@playwright/test");

const test = base.extend({
  page: async ({ page }, use) => {
    const javascriptErrors = [];
    const consoleErrors = [];
    const badResponses = [];

    page.on("pageerror", error => javascriptErrors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("response", response => {
      if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
    });

    await use(page);

    expect(javascriptErrors, "uncaught JavaScript errors").toEqual([]);
    expect(badResponses, "failed page or asset responses").toEqual([]);
    expect(consoleErrors, "browser console errors").toEqual([]);
  }
});

const orders = [
  {
    title: "Red tonic & forest stew",
    ingredients: ["Red tonic", "Wild herbs", "Mooncap", "Smoked meat"]
  },
  {
    title: "Mooncap hearth stew",
    ingredients: ["Wild herbs", "Mooncap", "Smoked meat"]
  },
  {
    title: "Sun lemon tonic",
    ingredients: ["Red tonic", "Sun lemon", "Wild herbs"]
  }
];

async function prepareAndServe(page, order) {
  for (const ingredient of order.ingredients) {
    await page.getByRole("button", { name: ingredient, exact: true }).click();
  }

  await expect(page.locator("#button-label")).toHaveText("Prepare order");
  await expect(page.locator("#serve-button")).toBeEnabled();
  await page.locator("#serve-button").click();
  await expect(page.locator("#button-label")).toHaveText(/Preparing/);
  await expect(page.locator("#button-label")).toHaveText(/Serve to /, { timeout: 4_000 });
  await page.locator("#serve-button").click();
  await expect(page.locator("#order-result")).toBeVisible();
  await expect(page.locator("#hearts")).toHaveAttribute("aria-label", "3 out of 3 hearts");
}

test("loads the artwork and keeps the order text clear of the hearts on a phone screen", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#game-stage")).toBeVisible();

  await page.locator("img").evaluateAll(images => Promise.all(images.map(image => image.decode().catch(() => null))));
  const artwork = await page.locator("img").evaluateAll(images => images.map(image => ({
    source: image.getAttribute("src"),
    loaded: image.complete && image.naturalWidth > 0
  })));
  expect(artwork.filter(image => !image.loaded), "all visible and initial-order images should load").toEqual([]);
  expect(await page.locator("#customer").getAttribute("src")).toMatch(/assets\/customer_.*\.png$/);

  const layout = await page.evaluate(() => {
    const caption = document.querySelector("#order-caption").getBoundingClientRect();
    const hearts = document.querySelector("#hearts").getBoundingClientRect();
    const bubble = document.querySelector(".order-bubble").getBoundingClientRect();
    return {
      captionBottom: caption.bottom,
      heartsTop: hearts.top,
      heartsBottom: hearts.bottom,
      bubbleTop: bubble.top,
      bubbleBottom: bubble.bottom,
      viewportHeight: innerHeight
    };
  });
  expect(layout.captionBottom).toBeLessThanOrEqual(layout.heartsTop + 1);
  expect(layout.heartsTop).toBeGreaterThanOrEqual(layout.bubbleTop);
  expect(layout.heartsBottom).toBeLessThanOrEqual(layout.bubbleBottom);
  expect(layout.bubbleBottom).toBeLessThanOrEqual(layout.viewportHeight);
});

test("plays through each recipe, rewards correct service, and rotates customers", async ({ page }) => {
  await page.goto("/");
  const customersSeen = [await page.locator("#customer").getAttribute("src")];
  let expectedCoins = Number(await page.locator("#coin-count").textContent());

  for (let index = 0; index < orders.length; index += 1) {
    const order = orders[index];
    await expect(page.locator("#order-caption")).toHaveText(order.title);
    await prepareAndServe(page, order);
    await expect(page.locator("#result-title")).toHaveText("A perfect pairing!");
    const resultCopy = await page.locator("#result-copy").textContent();
    const reward = Number(resultCopy.match(/\+(\d+) coins/)[1]);
    expect(reward).toBeGreaterThan(0);
    expectedCoins += reward;
    await expect(page.locator("#coin-count")).toHaveText(String(expectedCoins));

    await page.locator("#again-button").click();
    if (index < orders.length - 1) {
      await expect(page.locator("#order-caption")).toHaveText(orders[index + 1].title);
    }
    customersSeen.push(await page.locator("#customer").getAttribute("src"));
  }

  expect(customersSeen.every(source => /assets\/customer_.*\.png$/.test(source))).toBeTruthy();
  for (let index = 1; index < customersSeen.length; index += 1) {
    expect(customersSeen[index]).not.toBe(customersSeen[index - 1]);
  }
  await expect(page.locator("#order-caption")).toHaveText(orders[0].title);
});

test("clears ingredient selection and toggles the sound icon state", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#serve-button")).toBeDisabled();
  await page.getByRole("button", { name: "Red tonic", exact: true }).click();
  await expect(page.locator("#ingredient-count")).toHaveText("1 / 4");
  await page.locator("#clear-button").click();
  await expect(page.locator("#ingredient-count")).toHaveText("0 / 4");
  await expect(page.locator("#serve-button")).toBeDisabled();

  const audioToggle = page.locator("#audio-toggle");
  await audioToggle.click();
  await expect(audioToggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#audio-icon")).toHaveAttribute("src", "assets/icons/volume_off_icon.png");
  await audioToggle.click();
  await expect(audioToggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#audio-icon")).toHaveAttribute("src", "assets/icons/volume_on_icon.png");
});

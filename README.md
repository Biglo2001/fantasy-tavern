# The Lantern & Ladle prototype

A touch-friendly landscape browser prototype for the fantasy tavern game. It uses a swappable daytime tavern background with a separate counter foreground, four randomly rotating customer portraits, PNG ingredient icons, music, and sound effects in `assets/`.

## Play

Open `index.html` in a modern browser. Turn a phone sideways to play; portrait orientation displays a rotate-device prompt.

## Try the loop

1. Select the requested ingredients from the tray.
2. Prepare the order and watch the tavern's alchemy effects.
3. Serve the current guest and see how many hearts the result earns. Guests are randomly selected for each new order without consecutive repeats.
4. Continue through the three sample orders and start the next day.

The prototype includes an alchemy-and-stew pairing, a mushroom stew, and a lemon tonic. Incorrect selections are allowed and affect the guest's reaction and coin reward.

The tavern music begins after the first interaction to satisfy browser autoplay rules. Use the music-note button at the top to mute or unmute music and effects.

## Automated browser tests

The GitHub Actions workflow runs the Playwright browser suite on every push and pull request. The suite checks for uncaught JavaScript exceptions, console errors, failed page or asset requests, missing artwork, phone-sized order-bubble layout issues, recipe preparation and serving, coin rewards, customer rotation, selection clearing, and the sound toggle. A failed test blocks deployment to GitHub Pages.

To run the same checks locally, use Node.js 20 or later:

```sh
npm ci
npx playwright install chromium
npm test
```

To watch the tests run live in a browser window, use:

```sh
npx playwright test --headed
```

## Current scope

This is a visual and gameplay prototype, not a production mobile game. Progress resets when the page reloads. Preparation animations are placeholders, and the current supplied audio clips are prototypes for the final sound mix.

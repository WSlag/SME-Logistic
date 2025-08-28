# Snake (Vanilla JS)

A simple, modern Snake game built with HTML5 Canvas and vanilla JavaScript. No build step or dependencies required.

## Run locally

- Open the `index.html` file in any modern browser, or
- Serve the folder and open in a browser:

```bash
python3 -m http.server -d /workspace/snake 8080
# Then visit http://localhost:8080
```

## Controls

- Arrows or WASD: Move
- Space: Pause / Resume
- Enter: Restart
- Touch devices: Swipe to move; tap to pause/resume

## Features

- Responsive, crisp canvas that adapts to DPI and window size
- Smooth animation with speed increasing as you eat food
- Pause / Resume and Restart buttons
- Score and persistent Best score (localStorage)
- Keyboard and touch controls

## Notes

- Colliding with walls or yourself ends the game
- Best score is stored under `localStorage["snake_best"]`
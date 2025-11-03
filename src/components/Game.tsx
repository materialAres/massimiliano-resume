// src/Game.jsx

import { useEffect, useRef } from "react";
import kaplay from "kaplay";
import { loadGameSprites } from "../utils/utils";

function Game() {
  // 1. Create a ref for the canvas element
  const canvasRef = useRef(null);

  // 2. Initialize Kaplay inside a useEffect hook
  // This ensures Kaplay only runs on the client-side
  // and only after the component has mounted.
  useEffect(() => {
    // Make sure the ref is connected
    if (!canvasRef.current) {
      return;
    }

    // 3. Initialize the Kaplay context
    const k = kaplay({
      canvas: canvasRef.current, // Pass the canvas element
      //width: window.innerWidth,
      //height: window.innerHeight,
      background: [165, 217, 253], // Black background
    });

    k.loadFont("pixel-font", "/fonts/PressStart2P-Regular.ttf");
    loadGameSprites(k);

    // 4. Add your game logic!
    k.scene("main", () => {
      k.setGravity(1600);
      // Add a simple "hello" text
      k.add([
        k.text("Massimiliano Aresu", { font: "pixel-font" }),
        k.pos(k.width() / 2, 24),
        k.anchor("top"),
        k.color(255, 255, 255),
      ]);

      k.add([
        k.text("Your friendly neighborhood nerd", {
          font: "pixel-font",
          size: 16,
        }),
        k.pos(k.width() / 2, 80),
        k.anchor("top"),
        k.color(255, 255, 255),
      ]);

      // Add a player
      const player = k.add([
        k.sprite("player-idle"), // Start with idle sprite
        k.pos(100, 100),
        k.area(), // Enable collision detection
        k.body(), // Enable physics
        k.stay(["main"]),
        k.scale(1),
      ]);

      // Track player state
      let isMoving = false;
      let facingRight = true;

      // Animation frame tracking
      let runFrame = 1;
      let frameTimer = 0;
      const FRAME_DURATION = 0.12;

      // Confine player to screen boundaries
      player.onUpdate(() => {
        // Check left boundary
        if (player.pos.x < 0) {
          player.pos.x = 0;
        }

        // Check right boundary
        // player.width is 40 (from k.rect(40, 40))
        if (player.pos.x + player.width > k.width()) {
          player.pos.x = k.width() - player.width;
        }
      });

      // Add a floor
      k.add([
        k.rect(k.width(), 20),
        k.pos(0, k.height() - 100),
        k.color(0, 255, 0),
        k.area(),
        k.body({ isStatic: true }), // Makes it immovable
        k.outline(2),
      ]);

      k.add([
        k.sprite("box-work"),
        k.pos(250, 350),
        k.area(),
        k.body({ isStatic: true }), // Makes it immovable
        k.outline(2),
      ]);

      k.add([
        k.sprite("box-edu"),
        k.pos(550, 350),
        k.area(),
        k.body({ isStatic: true }), // Makes it immovable
        k.outline(2),
      ]);

      k.add([
        k.sprite("box-proj"),
        k.pos(850, 350),
        k.area(),
        k.body({ isStatic: true }), // Makes it immovable
        k.outline(2),
      ]);

      k.onUpdate(() => {
        if (isMoving) {
          frameTimer += k.dt(); // k.dt() gives delta time

          if (frameTimer >= FRAME_DURATION && player.isGrounded()) {
            frameTimer = 0;
            runFrame = runFrame === 3 ? 1 : runFrame + 1;
            player.use(k.sprite(`player-run-${runFrame}`));
          }
        } else if (player.isGrounded() && !player.isJumping()) {
          player.use(k.sprite(`player-idle`));
        }

        // Flip sprite based on direction
        player.flipX = !facingRight;
      });

      // Jump action
      k.onKeyPress("space", () => {
        if (player.isGrounded()) {
          player.jump();
          player.use(k.sprite("player-jump"));
        }
      });

      // Define a movement speed
      const SPEED = 320;

      // Move left
      k.onKeyDown("left", () => {
        player.move(-SPEED, 0);
        isMoving = true;
        facingRight = false;
      });

      // Move right
      k.onKeyDown("right", () => {
        player.move(SPEED, 0);
        isMoving = true;
        facingRight = true;
      });

      // Reset to idle when no movement keys are pressed
      k.onKeyRelease("left", () => {
        isMoving = false;
        player.use(k.sprite("player-idle"));
        frameTimer = 0;
        runFrame = 1;
      });

      k.onKeyRelease("right", () => {
        isMoving = false;
        player.use(k.sprite("player-idle"));
        frameTimer = 0;
        runFrame = 1;
      });
    });

    // Start the 'main' scene
    k.go("main");

    // ADD THIS CLEANUP FUNCTION:
    // This tells React how to "destroy" the Kaplay instance
    // when the component unmounts (which Strict Mode does automatically).
    return () => {
      k.quit();
    };
  }, [canvasRef]); // The empty array ensures this effect runs only once

  // 5. Render the canvas element for Kaplay to use
  return <canvas ref={canvasRef}></canvas>;
}

export default Game;

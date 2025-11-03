import { useEffect, useRef } from "react";
import kaplay from "kaplay";
import { loadGameSprites } from "../utils/utils";

function Game() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const k = kaplay({
      canvas: canvasRef.current,
      background: [165, 217, 253],
    });

    // k.loadFont("pixel-font", "/fonts/PressStart2P-Regular.ttf");
    loadGameSprites(k);

    k.scene("main", () => {
      k.setGravity(1600);

      // Remove the text elements - they'll be HTML now

      // Add a player
      const player = k.add([
        k.sprite("player-idle"),
        k.pos(100, 100),
        k.area(),
        k.body(),
        k.stay(["main"]),
        k.scale(1),
      ]);

      let isMoving = false;
      let facingRight = true;
      let runFrame = 1;
      let frameTimer = 0;
      const FRAME_DURATION = 0.12;

      player.onUpdate(() => {
        if (player.pos.x < 0) {
          player.pos.x = 0;
        }
        if (player.pos.x + player.width > k.width()) {
          player.pos.x = k.width() - player.width;
        }
      });

      // Add a floor
      const floorHeight = k.height() - 100;
      k.add([
        k.rect(k.width(), 20),
        k.pos(0, floorHeight),
        k.color(0, 255, 0),
        k.area(),
        k.body({ isStatic: true }),
        k.outline(2),
      ]);

      const boxDistanceFromFloor = 170;

      k.add([
        k.sprite("box-work"),
        k.pos(k.width() / 4, floorHeight - boxDistanceFromFloor),
        k.anchor("center"),
        k.area(),
        k.body({ isStatic: true }),
        k.outline(2),
      ]);

      k.add([
        k.sprite("box-edu"),
        k.pos(k.width() / 2, floorHeight - boxDistanceFromFloor),
        k.anchor("center"),
        k.area(),
        k.body({ isStatic: true }),
        k.outline(2),
      ]);

      k.add([
        k.sprite("box-proj"),
        k.pos((k.width() / 4) * 3, floorHeight - boxDistanceFromFloor),
        k.anchor("center"),
        k.area(),
        k.body({ isStatic: true }),
        k.outline(2),
      ]);

      k.onUpdate(() => {
        if (isMoving) {
          frameTimer += k.dt();
          if (frameTimer >= FRAME_DURATION && player.isGrounded()) {
            frameTimer = 0;
            runFrame = runFrame === 3 ? 1 : runFrame + 1;
            player.use(k.sprite(`player-run-${runFrame}`));
          }
        } else if (player.isGrounded() && !player.isJumping()) {
          player.use(k.sprite(`player-idle`));
        }
        player.flipX = !facingRight;
      });

      k.onKeyPress("space", () => {
        if (player.isGrounded()) {
          player.jump();
          player.use(k.sprite("player-jump"));
        }
      });

      const SPEED = 320;

      k.onKeyDown("left", () => {
        player.move(-SPEED, 0);
        isMoving = true;
        facingRight = false;
      });

      k.onKeyDown("right", () => {
        player.move(SPEED, 0);
        isMoving = true;
        facingRight = true;
      });

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

    k.go("main");

    return () => {
      k.quit();
    };
  }, [canvasRef]);

  return (
    <div className="relative w-full h-screen">
      <canvas ref={canvasRef} className="block w-full h-full"></canvas>

      {/* HTML Overlay */}
      <div className="absolute top-0 left-0 w-full pointer-events-none p-5 mt-5 text-center">
        <h1 className="font-['Press_Start_2P'] text-white text-3xl drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] mb-2.5">
          Massimiliano Aresu
        </h1>

        <p className="font-['Press_Start_2P'] text-white text-sm drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] m-0">
          Your friendly neighborhood Web Dev
        </p>
      </div>
    </div>
  );
}

export default Game;

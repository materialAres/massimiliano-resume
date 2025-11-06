import { useEffect, useRef, useState } from "react";
import kaplay from "kaplay";
import { loadGameSprites } from "../utils/utils";

function Game() {
  const canvasRef = useRef(null);
  const [isWorkHit, setIsWorkHit] = useState(false);
  const [isEducationHit, setIsEducationHit] = useState(false);
  const [isProjectsHit, setIsProjectsHit] = useState(false);

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
        "player",
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

      const createBumpBox = (sprite, xPos) => {
        const originalY = floorHeight - boxDistanceFromFloor;
        const box = k.add([
          k.sprite(sprite),
          k.pos(xPos, originalY),
          k.anchor("center"),
          k.area(),
          k.body({ isStatic: true }),
          k.outline(2),
          "box", // Tag for collision detection
        ]);

        let isBumping = false;
        let bumpTimer = 0;
        const BUMP_HEIGHT = 20; // How far up the box moves
        const BUMP_DURATION = 0.3; // Total duration of bump animation

        box.onUpdate(() => {
          if (isBumping) {
            bumpTimer += k.dt();

            // Calculate bump offset using a smooth up-and-down motion
            const progress = bumpTimer / BUMP_DURATION;

            if (progress < 1) {
              // Sine wave for smooth up and down motion
              const offset = Math.sin(progress * Math.PI) * BUMP_HEIGHT;
              box.pos.y = originalY - offset;
            } else {
              // Animation complete, reset
              box.pos.y = originalY;
              isBumping = false;
              bumpTimer = 0;
            }
          }
        });

        // Trigger bump when player collides from below
        box.onCollide("player", (p) => {
          if (!isBumping && p.pos.y > box.pos.y) {
            if (sprite === "box-work") {
              setIsWorkHit(true);
              setIsEducationHit(false);
              setIsProjectsHit(false);
            } else if (sprite === "box-edu") {
              setIsWorkHit(false);
              setIsEducationHit(true);
              setIsProjectsHit(false);
            } else if (sprite === "box-proj") {
              setIsWorkHit(false);
              setIsEducationHit(false);
              setIsProjectsHit(true);
            }
            // Only bump if player is above the box (hitting from below)
            isBumping = true;
            bumpTimer = 0;
          }
        });

        return box;
      };

      // Create the three boxes evenly spaced
      createBumpBox("box-work", k.width() / 4);
      createBumpBox("box-edu", k.width() / 2);
      createBumpBox("box-proj", (k.width() / 4) * 3);

      for (let i = 0; i < 4; i++) {
        const cloudHeight = i % 2 === 0 ? 300 + i * 30 : 280 - i * 30;
        k.add([
          k.sprite(`cloud-${i + 1}`),
          k.pos((k.width() / 4) * i + 200, floorHeight - cloudHeight),
          k.anchor("center"),
          k.z(-10),
        ]);
      }

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
        <h1 className="text-white text-3xl drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] mb-2.5">
          Massimiliano Aresu
        </h1>

        <p className="text-white text-sm drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] m-0">
          Your friendly neighborhood Web Dev
        </p>
        {isWorkHit && (
          <div className="mt-6 px-56 text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] animate-[pixelScale_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
            <h2 className="text-lg">Work Experience</h2>
            <p className="text-sm">Front-End Developer - EY</p>
            <p className="text-xs">Apr 2024 - Present</p>
            <p className="text-xs">Cagliari, Italy</p>
            <br />
            <p className="text-sm">Full-Stack Developer - Clariter</p>
            <p className="text-xs">Feb 2023 - Feb 2024</p>
            <p className="text-xs">Remote, Italy</p>
          </div>
        )}
        {isEducationHit && (
          <div className="mt-6 px-56 text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] animate-[pixelScale_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
            <h2 className="text-lg">Education</h2>
            <p className="text-sm">
              Banchelor Degree in Languages and Mediation
            </p>
            <p className="text-xs">Cagliari, Italy</p>
          </div>
        )}
        {isProjectsHit && (
          <div className="mt-6 px-56 text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] animate-[pixelScale_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
            <h2 className="text-lg">Projects</h2>
            <p className="text-sm">The Tempest Videogame</p>
            <p className="text-xs">
              An adventure game made with RPG Maker MV based on Shakespeare'
              play The Tempest
            </p>
            <br />
            <p className="text-sm">Portfolio page</p>
            <p className="text-xs">
              Gamified portfolio page built with React and Kaplay
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;

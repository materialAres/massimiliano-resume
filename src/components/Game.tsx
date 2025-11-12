import { useEffect, useRef, useState } from "react";
import kaplay from "kaplay";
import { boxMap, createBumpBox, loadGameSprites } from "../utils/utils";

function Game() {
  const canvasRef = useRef(null);
  const [activeBox, setActiveBox] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    // INIT KAPLAY AND SPRITES
    const k = kaplay({
      canvas: canvasRef.current,
      background: [165, 217, 253],
    });

    loadGameSprites(k);

    k.scene("main", () => {
      k.setGravity(1600);

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

      // Floor
      const floorHeight = k.height() - 42;
      k.add([
        k.sprite("ground"),
        k.pos(0, floorHeight + 18),
        k.anchor("center"),
        k.scale(2),
      ]);

      // Invisible collision box to improve visual
      k.add([
        k.rect(k.width(), 40),
        k.pos(0, floorHeight),
        k.opacity(0), // Make it invisible
        k.area(),
        k.body({ isStatic: true }),
      ]);

      const boxDistanceFromFloor = 170;

      // Section boxes
      createBumpBox(
        "box-work",
        k.width() / 4,
        k,
        floorHeight,
        boxDistanceFromFloor,
        setActiveBox
      );
      createBumpBox(
        "box-edu",
        k.width() / 2,
        k,
        floorHeight,
        boxDistanceFromFloor,
        setActiveBox
      );
      createBumpBox(
        "box-proj",
        (k.width() / 4) * 3,
        k,
        floorHeight,
        boxDistanceFromFloor,
        setActiveBox
      );

      for (let i = 0; i < 5; i++) {
        const cloudHeight = i % 2 === 0 ? 300 + i * 30 : 280 - i * 30;
        k.add([
          k.sprite(`cloud-${i + 1}`),
          k.pos((k.width() / 5) * i + 100, floorHeight - cloudHeight),
          k.anchor("center"),
          k.z(-10),
          k.scale(i === 4 ? 1.2 : 1),
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
        {activeBox === "work" && (
          <div className="mt-10 md:mt-6 mx-4 md:mx-72 text-white animate-[pixelScale_0.4s_ease-out]">
            <div className="bg-[#E0B45D] border-4 border-[#5D2E0F] rounded-lg p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] relative before:absolute before:inset-2 before:border-2 before:border-[#a17c32] before:rounded before:pointer-events-none">
              <div className="relative z-10">
                <h2 className="text-lg mb-3">Work Experience</h2>
                <p className="text-sm">Front-End Developer - EY</p>
                <p className="text-xs">Apr 2024 - Present</p>
                <p className="text-xs mb-3">Cagliari, Italy</p>
                <p className="text-sm">Full-Stack Developer - Clariter</p>
                <p className="text-xs">Feb 2023 - Feb 2024</p>
                <p className="text-xs">Remote, Italy</p>
              </div>
            </div>
          </div>
        )}

        {activeBox === "education" && (
          <div className="mt-10 md:mt-6 mx-4 md:mx-72 text-white animate-[pixelScale_0.4s_ease-out]">
            <div className="bg-[#E0B45D] border-4 border-[#5D2E0F] rounded-lg p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] relative before:absolute before:inset-2 before:border-2 before:border-[#a17c32] before:rounded before:pointer-events-none">
              <div className="relative z-10">
                <h2 className="text-lg mb-3">Education</h2>
                <p className="text-sm">
                  Bachelor Degree in Languages and Mediation
                </p>
                <p className="text-xs">Cagliari, Italy</p>
              </div>
            </div>
          </div>
        )}

        {activeBox === "projects" && (
          <div className="mt-10 md:mt-6 mx-4 md:mx-72 text-white animate-[pixelScale_0.4s_ease-out]">
            <div className="bg-[#E0B45D] border-4 border-[#5D2E0F] rounded-lg p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] relative before:absolute before:inset-2 before:border-2 before:border-[#a17c32] before:rounded before:pointer-events-none">
              <div className="relative z-10">
                <h2 className="text-lg mb-3">Projects</h2>
                <p className="text-sm">The Tempest Videogame</p>
                <p className="text-xs mb-3">
                  An adventure game made with RPG Maker MV based on
                  Shakespeare's play The Tempest
                </p>
                <p className="text-sm">Portfolio page</p>
                <p className="text-xs">
                  Gamified portfolio page built with React and Kaplay
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;

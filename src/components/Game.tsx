import { useEffect, useRef, useState } from "react";
import kaplay, { type KAPLAYCtx } from "kaplay";
import {
  createBumpBox,
  isTouchScreenDevice,
  loadGameSprites,
  loadSounds,
} from "../utils/utils";
import { useOrientation } from "../hooks/useOrientation";
import useHasSmallHeight from "../hooks/useIsMobile";
import { boxData } from "../data/boxData";
import { InfoBox } from "./InfoBox";
import type { activeBoxType } from "../types/types";

function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeBox, setActiveBox] = useState<activeBoxType>(null);
  const [isInStartScreen, setIsInStartScreen] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const isMobile = isTouchScreenDevice();
  const isPortrait = useOrientation();
  const hasSmallHeight = useHasSmallHeight();

  // Mobile controls state
  const [mobileControls, setMobileControls] = useState({
    left: false,
    right: false,
    jump: false,
  });

  const mobileControlsRef = useRef(mobileControls);

  useEffect(() => {
    mobileControlsRef.current = mobileControls;
  }, [mobileControls]);

  useEffect(() => {
    if (activeBox) {
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 5500);

      const removeTimer = setTimeout(() => {
        setActiveBox(null);
        setIsFading(false);
      }, 6000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [activeBox]);

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
    loadSounds(k);

    k.scene("start", () => {
      setIsInStartScreen(true);

      k.onKeyPress("space", () => {
        k.play("bgmusic", { loop: true, volume: 0.2 }); // Start background music
        k.go("main");
      });
    });

    k.scene("main", () => {
      setIsInStartScreen(false);
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
      const FRAME_DURATION = 0.1;
      let stepSoundTimer = 0;
      const STEP_SOUND_INTERVAL = 0.25;

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
        setActiveBox,
      );
      createBumpBox(
        "box-edu",
        k.width() / 2,
        k,
        floorHeight,
        boxDistanceFromFloor,
        setActiveBox,
      );
      createBumpBox(
        "box-proj",
        (k.width() / 4) * 3,
        k,
        floorHeight,
        boxDistanceFromFloor,
        setActiveBox,
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

      const SPEED = 320;

      k.onUpdate(() => {
        // Handle movement logic (both keyboard and touch)
        const left = k.isKeyDown("a") || mobileControlsRef.current.left;
        const right = k.isKeyDown("d") || mobileControlsRef.current.right;
        const jump = k.isKeyPressed("w") || mobileControlsRef.current.jump;

        if (jump && player.isGrounded()) {
          player.jump();
          player.use(k.sprite("player-jump"));
          k.play("jump", { volume: 0.3 });
        }

        if (left) {
          player.move(-SPEED, 0);
          isMoving = true;
          facingRight = false;
        } else if (right) {
          player.move(SPEED, 0);
          isMoving = true;
          facingRight = true;
        } else {
          isMoving = false;
        }

        if (isMoving && player.isGrounded()) {
          stepSoundTimer += k.dt();

          if (stepSoundTimer >= STEP_SOUND_INTERVAL) {
            k.play("step", { volume: 3 });
            stepSoundTimer = 0;
          }

          frameTimer += k.dt();
          if (frameTimer >= FRAME_DURATION) {
            frameTimer = 0;
            runFrame = runFrame === 4 ? 1 : runFrame + 1;
            player.use(k.sprite(`player-run-${runFrame}`));
          }
        } else {
          stepSoundTimer = 0; // Reset when not moving
          if (player.isGrounded() && !player.isJumping()) {
            player.use(k.sprite(`player-idle`));
          }
        }
        player.flipX = !facingRight;
      });
    });

    k.go("start");
    kRef.current = k;

    return () => {
      k.quit();
    };
  }, [canvasRef]);

  const kRef = useRef<KAPLAYCtx>(null);

  const handleStartGame = () => {
    canvasRef.current?.focus();
    if (isMobile && kRef.current) {
      kRef.current.play("bgmusic", { loop: true, volume: 0.2 });
      kRef.current.go("main");
    }
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="block w-full h-full focus:outline-none"
        tabIndex={0}
      ></canvas>
      {/* TODO: Refactor */}
      {isPortrait && (
        <div className="fixed inset-0 bg-[#a5b9fd] z-50 flex items-center justify-center p-6">
          <div className="text-center text-white max-w-md">
            <h1 className="text-3xl font-bold mb-4">
              Please Rotate Your Device
            </h1>

            <p className="text-lg text-gray-200 mb-6">
              The experience is best enjoyed in landscape mode
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
              <div className="w-8 h-12 border-2 border-white rounded"></div>
              <span className="text-2xl">→</span>
              <div className="w-12 h-8 border-2 border-white rounded"></div>
            </div>
          </div>
        </div>
      )}
      {isInStartScreen && !isPortrait ? (
        <div
          className="absolute top-0 left-0 w-full h-screen bg-[#a5d9fd] flex flex-col justify-center items-center z-20"
          onClick={handleStartGame}
        >
          <h1 className="text-white text-4xl mb-6 animate-pulse">
            {isMobile ? "Tap to Start" : "Press SPACE to Start"}
          </h1>
        </div>
      ) : (
        <>
          {/* Help Button */}
          {!isMobile && (
            <div className="absolute top-8 left-4 z-30">
              <button
                className="bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white px-4 py-2 rounded-lg hover:bg-white/40 transition-colors font-bold"
                onClick={() => setShowHelp(!showHelp)}
              >
                Help
              </button>
              {showHelp && (
                <div className="absolute top-full left-0 mt-2 bg-black/80 text-white p-4 rounded-lg w-48 backdrop-blur-md border border-white/20">
                  <h3 className="font-bold mb-2 border-b border-white/20 pb-1">
                    Controls
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Move:</span>
                      <span className="font-mono bg-white/20 px-1 rounded">
                        A / D
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jump:</span>
                      <span className="font-mono bg-white/20 px-1 rounded">
                        W
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            className={`absolute top-0 left-0 w-full pointer-events-none p-5`}
          >
            <h1 className="text-white text-lg text-right lg:text-4xl lg:text-center drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] mb-2.5">
              Massimiliano Aresu
            </h1>

            <p className="text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] m-0 text-[10px] text-right lg:text-base lg:text-center">
              Your friendly neighborhood Web Dev
            </p>
            {activeBox && boxData[activeBox] && (
              <InfoBox
                title={boxData[activeBox].title}
                items={boxData[activeBox].items}
                isMobile={isMobile}
                hasSmallHeight={hasSmallHeight}
                isFading={isFading}
              />
            )}
          </div>
        </>
      )}

      {/* Mobile Controls */}
      {isMobile && !isInStartScreen && (
        <>
          <div className="absolute bottom-2 left-8 flex gap-6 z-30">
            <button
              className="w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-full flex items-center justify-center active:bg-white/40 transition-colors"
              onTouchStart={(e) => {
                e.preventDefault(); // Prevent scrolling/selection
                setMobileControls((prev) => ({ ...prev, left: true }));
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setMobileControls((prev) => ({ ...prev, left: false }));
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="white"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              className="w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-full flex items-center justify-center active:bg-white/40 transition-colors"
              onTouchStart={(e) => {
                e.preventDefault();
                setMobileControls((prev) => ({ ...prev, right: true }));
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setMobileControls((prev) => ({ ...prev, right: false }));
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="white"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-2 right-8 z-30">
            <button
              className="w-14 h-14 bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-full flex items-center justify-center active:bg-white/40 transition-colors"
              onTouchStart={(e) => {
                e.preventDefault();
                setMobileControls((prev) => ({ ...prev, jump: true }));
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setMobileControls((prev) => ({ ...prev, jump: false }));
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <span
                className="text-white font-bold text-xs"
                style={{
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                  userSelect: "none",
                }}
              >
                JUMP
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Game;

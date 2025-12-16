import { useEffect, useRef, useState } from "react";
import kaplay, { type KAPLAYCtx } from "kaplay";
import {
  createBumpBox,
  isTouchScreenDevice,
  loadGameSprites,
  loadSounds,
} from "../utils/utils";
import { useOrientation } from "../hooks/useOrientation";
import useHasSmallHeight from "../hooks/useHasSmallHeight";
import { boxData } from "../data/boxData";
import { InfoBox } from "./InfoBox";
import type { activeBoxType } from "../types/types";
import MovementButtons from "./buttons/MovementButtons";
import { ControlsSection } from "./misc/ControlsSection";
import { RotateDeviceMessage } from "./misc/RotateDeviceMessage";

function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeBox, setActiveBox] = useState<activeBoxType>(null);
  const [isInStartScreen, setIsInStartScreen] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const isTouchScreen = isTouchScreenDevice();
  const isPortrait = useOrientation();
  const hasSmallHeight = useHasSmallHeight();
  const isTightScreen = useHasSmallHeight(300);

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
      const numBoxes = 4;
      const spacing = k.width() / (numBoxes + 1);

      // Section boxes
      createBumpBox(
        "box-me",
        spacing * 1,
        k,
        floorHeight,
        boxDistanceFromFloor,
        setActiveBox,
      );
      createBumpBox(
        "box-work",
        spacing * 2,
        k,
        floorHeight,
        boxDistanceFromFloor,
        setActiveBox,
      );
      createBumpBox(
        "box-edu",
        spacing * 3,
        k,
        floorHeight,
        boxDistanceFromFloor,
        setActiveBox,
      );
      createBumpBox(
        "box-proj",
        spacing * 4,
        k,
        floorHeight,
        boxDistanceFromFloor,
        setActiveBox,
      );

      for (let i = 0; i < 5; i++) {
        const cloudHeight =
          i % 2 === 0
            ? window.innerHeight > 300
              ? 300 + i * 30
              : 150 + i * 30
            : window.innerHeight > 300
              ? 280 - i * 30
              : 130 - i * 30;

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
        const jump = k.isKeyPressed("space") || mobileControlsRef.current.jump;

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
    if (isTouchScreen && kRef.current) {
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
      {/* Rotate your device */}
      {isPortrait && isTouchScreen && <RotateDeviceMessage />}
      {isInStartScreen && !isPortrait ? (
        <div
          className="absolute top-0 left-0 w-full h-screen bg-[#a5d9fd] flex flex-col justify-center items-center z-20"
          onClick={handleStartGame}
        >
          <h1 className="text-white text-4xl mb-6 animate-pulse">
            {isTouchScreen ? "Tap to Start" : "Press SPACE to Start"}
          </h1>
        </div>
      ) : (
        <>
          {/* Controls */}
          {!isTouchScreen && (
            <div className="absolute top-4 left-4 z-30 pointer-events-none">
              <ControlsSection />
            </div>
          )}

          <div
            className={`absolute top-0 left-0 w-full p-5 pointer-events-none`}
          >
            {!isTightScreen && (
              <>
                <h1 className="text-white text-lg text-right lg:text-4xl lg:text-center drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] mb-2.5">
                  Massimiliano Aresu
                </h1>

                <p className="text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] m-0 text-[10px] text-right lg:text-base lg:text-center">
                  Your friendly neighborhood Web Dev
                </p>
              </>
            )}
            {activeBox && boxData[activeBox] && (
              <InfoBox
                title={boxData[activeBox].title}
                items={boxData[activeBox].items}
                isTouchScreen={isTouchScreen}
                hasSmallHeight={hasSmallHeight}
                isFading={isFading}
              />
            )}
          </div>
        </>
      )}

      {/* Mobile Controls */}
      {isTouchScreen && !isInStartScreen && (
        <MovementButtons setMobileControls={setMobileControls} />
      )}
    </div>
  );
}

export default Game;

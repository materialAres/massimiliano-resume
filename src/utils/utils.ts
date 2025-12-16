import type { Collision, GameObj, KAPLAYCtx } from "kaplay";
import { BOX_MAP, SOUND_FILES, SPRITE_FRAMES } from "../data/costants";
import type { Dispatch, SetStateAction } from "react";
import type { activeBoxType } from "../types/types";

export const loadGameSprites = (k: KAPLAYCtx) => {
  for (const [key, path] of Object.entries(SPRITE_FRAMES)) {
    k.loadSprite(key, path);
  }
};

export const loadSounds = (k: KAPLAYCtx) => {
  for (const [key, path] of Object.entries(SOUND_FILES)) {
    k.loadSound(key, path);
  }
};

export const createBumpBox = (
  sprite: string,
  xPos: number,
  k: KAPLAYCtx,
  floorHeight: number,
  boxDistanceFromFloor: number,
  setActiveBox: Dispatch<SetStateAction<activeBoxType>>,
) => {
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
  box.onCollide(
    "player",
    (_p: GameObj<unknown>, col: Collision | undefined) => {
      if (!col) {
        return;
      }

      if (!isBumping && col.isBottom()) {
        setActiveBox(BOX_MAP[sprite as keyof typeof BOX_MAP]);
        isBumping = true;
        bumpTimer = 0;
      }
    },
  );

  return box;
};

export const isTouchScreenDevice = () => {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (error) {
    console.log("Error catching touch event:", error);

    return false;
  }
};

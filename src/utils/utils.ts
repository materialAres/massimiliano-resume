export const SPRITE_FRAMES = {
  "player-idle": "/sprites/player-idle.png",
  "player-run-1": "/sprites/player-run-1.png",
  "player-run-2": "/sprites/player-run-2.png",
  "player-run-3": "/sprites/player-run-3.png",
  "player-run-4": "/sprites/player-run-4.png",
  "player-jump": "/sprites/player-jump.png",
  "box-work": "/assets/box-work.png",
  "box-edu": "/assets/box-edu.png",
  "box-proj": "/assets/box-proj.png",
  "cloud-1": "/assets/cloud-1.png",
  "cloud-2": "/assets/cloud-2.png",
  "cloud-3": "/assets/cloud-3.png",
  "cloud-4": "/assets/cloud-4.png",
  "cloud-5": "/assets/cloud-5.png",
  ground: "/assets/ground.png",
};

export const boxMap = {
  "box-work": "work",
  "box-edu": "education",
  "box-proj": "projects",
};

export const loadGameSprites = (k: any) => {
  for (const [key, path] of Object.entries(SPRITE_FRAMES)) {
    k.loadSprite(key, path);
  }
};

export const createBumpBox = (
  sprite: string,
  xPos: number,
  k: any,
  floorHeight: number,
  boxDistanceFromFloor: number,
  setActiveBox: any,
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
  box.onCollide("player", (_p: any, col: any) => {
    if (!isBumping && col.isBottom()) {
      setActiveBox(boxMap[sprite as keyof typeof boxMap]);
      isBumping = true;
      bumpTimer = 0;
    }
  });

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

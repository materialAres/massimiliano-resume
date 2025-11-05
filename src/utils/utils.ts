export const SPRITE_FRAMES = {
  "player-idle": "/sprites/player-idle.png",
  "player-run-1": "/sprites/player-run-1.png",
  "player-run-2": "/sprites/player-run-2.png",
  "player-run-3": "/sprites/player-run-3.png",
  "player-run-4": "/sprites/player-run-2.png",
  "player-jump": "/sprites/player-jump.png",
  "box-work": "/assets/box-work.png",
  "box-edu": "/assets/box-edu.png",
  "box-proj": "/assets/box-proj.png",
  "cloud-1": "/assets/cloud-1.png",
  "cloud-2": "/assets/cloud-2.png",
  "cloud-3": "/assets/cloud-3.png",
  "cloud-4": "/assets/cloud-4.png",
};

export const loadGameSprites = (k) => {
  for (const [key, path] of Object.entries(SPRITE_FRAMES)) {
    k.loadSprite(key, path);
  }
};

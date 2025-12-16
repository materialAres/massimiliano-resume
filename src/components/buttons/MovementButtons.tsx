import type { Dispatch, SetStateAction } from "react";
import { LeftButtonIcon } from "../icons/LeftButtonIcon";
import { RightButtonIcon } from "../icons/RightButtonIcon";

export const MovementButtons = ({
  setMobileControls,
}: {
  setMobileControls: Dispatch<
    SetStateAction<{ left: boolean; right: boolean; jump: boolean }>
  >;
}) => {
  return (
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
          <LeftButtonIcon />
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
          <RightButtonIcon />
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
  );
};

export default MovementButtons;

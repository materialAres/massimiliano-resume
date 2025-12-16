export const ControlsSection = () => {
  return (
    <div
      className="absolute top-full left-0 mt-2 p-4 w-64 bg-[#E0B45D]/60 border-4 border-[#8B4513] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
      style={{ imageRendering: "pixelated" }}
    >
      <h3 className="font-bold mb-3 pb-2 text-[#4A3728] border-b-2 border-[#8B4513] uppercase text-sm">
        Controls
      </h3>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex flex-row gap-1">
          <span className="text-[#4A3728] font-semibold">Move</span>
          <div className="flex flex-col font-mono text-[#4A3728] px-2 w-fit">
            <span>Left: A</span>
            <span>Right: D</span>
          </div>
        </div>
        <div className="flex flex-row gap-1">
          <span className="text-[#4A3728] font-semibold">Jump</span>
          <span className="font-mono text-[#4A3728] px-2 inline-block w-fit">
            W
          </span>
        </div>
      </div>
    </div>
  );
};

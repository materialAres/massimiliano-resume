import type { InfoBoxProps } from "../types/types";

export const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  items,
  isTouchScreen,
  hasSmallHeight,
  isFading,
}) => {
  return (
    <div
      key={title}
      className={`mt-10 lg:mt-6 ${
        isTouchScreen
          ? !hasSmallHeight
            ? "flex justify-center"
            : "absolute top-0 left-2 max-w-sm"
          : "flex justify-center"
      } text-white ${isFading ? "animate-[pixelScaleReverse_0.4s_ease-out_forwards]" : "animate-[pixelScale_0.4s_ease-out]"}`}
    >
      <div className="w-fit bg-[#E0B45D]/40 lg:bg-[#E0B45D] border-4 border-[#5D2E0F] rounded-lg p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] relative before:absolute before:inset-2 before:border-2 before:border-[#a17c32] before:rounded before:pointer-events-none">
        <div className="relative z-10 text-center drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] lg:p-2 max-w-xl">
          <h2 className="text-sm lg:text-xl mb-3">{title}</h2>
          {items.map((item, index) => (
            <div key={index} className={index < items.length - 1 ? "mb-3" : ""}>
              <p className="text-[10px] lg:text-base">{item.title}</p>
              {item.subtitle && (
                <p className="text-[8px] lg:text-sm">{item.subtitle}</p>
              )}
              {item.location && (
                <p className="text-[8px] lg:text-sm">{item.location}</p>
              )}
              {item.description && (
                <p className="text-[8px] lg:text-sm">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

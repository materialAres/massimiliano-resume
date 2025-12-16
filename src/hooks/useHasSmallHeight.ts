import { useState, useEffect } from "react";

const useHasSmallHeight = (height = 350) => {
  const [hasSmallHeight, setHasSmallHeight] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      setHasSmallHeight(window.innerHeight < height);
    };

    checkHeight();
    window.addEventListener("resize", checkHeight);

    return () => window.removeEventListener("resize", checkHeight);
  }, [height]);

  return hasSmallHeight;
};

export default useHasSmallHeight;

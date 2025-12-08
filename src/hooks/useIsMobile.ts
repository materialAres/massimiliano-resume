import { useState, useEffect } from "react";

const useHasSmallHeight = () => {
  const [hasSmallHeight, setHasSmallHeight] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      setHasSmallHeight(window.innerHeight < 350);
    };

    checkHeight();
    window.addEventListener("resize", checkHeight);

    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  return hasSmallHeight;
};

export default useHasSmallHeight;

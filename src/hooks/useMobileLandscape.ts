import { useState, useEffect } from 'react';

const MOBILE_MAX_SIZE = 700; // Define a threshold for max width/height of a "mobile" device

export const useMobileLandscape = () => {
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  const checkOrientation = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // A device is likely a mobile device if its height OR width is below the max size
    const isSmallDevice = width <= MOBILE_MAX_SIZE || height <= MOBILE_MAX_SIZE;

    // Is it in landscape mode? (Width > Height)
    const isLandscape = width > height;

    // It's a "Mobile Landscape" if it's a small device AND in landscape
    setIsMobileLandscape(isSmallDevice && isLandscape);
  };

  useEffect(() => {
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation); // Handles OS-level rotation

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return isMobileLandscape;
};

// Usage in a component:
// const isMobileLandscape = useMobileLandscape();
// if (isMobileLandscape) { /* render mobile landscape view */ }
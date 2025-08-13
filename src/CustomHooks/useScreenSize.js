import { useState, useEffect, useRef, useCallback, useMemo } from 'react';




const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenSize, setScreenSize] = useState('');


  // Define breakpoints similar to Bootstrap
  const breakpoints = useRef({
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
  });

  const getScreenSize = useCallback((width) => {
    if (width >= breakpoints.current.xxl) return 'xxl';
    if (width >= breakpoints.current.xl) return 'xl';
    if (width >= breakpoints.current.lg) return 'lg';
    if (width >= breakpoints.current.md) return 'md';
    if (width >= breakpoints.current.sm) return 'sm';
    return 'xs';
  }, []);

  const isOnMobileView = useMemo(() => screenSize === 'sm', [screenSize])



  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setScreenSize(getScreenSize(width));
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { screenSize, screenWidth, isOnMobileView,setScreenWidth };
};

export default useScreenSize;

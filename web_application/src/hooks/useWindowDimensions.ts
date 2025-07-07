import { useEffect, useState } from 'react';

interface WindowDimentions {
    width: number | undefined;
    height: number | undefined;
}

const initialValues = {
    width: undefined,
    height: undefined,
};

const useWindowDimensions = (): WindowDimentions => {
    const [windowDimensions, setWindowDimensions] =
        useState<WindowDimentions>(initialValues);

    useEffect(() => {
        function handleResize(): void {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        return (): void => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};

export default useWindowDimensions;

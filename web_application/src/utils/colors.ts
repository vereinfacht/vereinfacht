import { ColorObject } from '@/types/global';

export const defaultClubPrimaryColor = '#005032';

export function hexToRgb(hex: string): ColorObject | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

export function hexToCssString(hex: string): string {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        throw new Error('Invalid hex color');
    }
    return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
}

export function contrastRatio(hexColor1: string, hexColor2?: string): number {
    const brightness1 = getBrightnessFromHex(hexColor1);
    let brightness2 = 255;

    if (hexColor2) {
        brightness2 = getBrightnessFromHex(hexColor2);
    }

    return Math.abs(brightness2 / brightness1);
}

export function shouldUseDarkMode(primaryColor: string): boolean {
    const targetContrastRatio = 2.5;
    return contrastRatio(primaryColor) > targetContrastRatio;
}

export function getBrightnessFromHex(hex: string): number {
    const rgbObject = hexToRgb(hex);

    if (!rgbObject) {
        return 255;
    }

    return (299 * rgbObject.r + 587 * rgbObject.g + 114 * rgbObject.b) / 1000;
}

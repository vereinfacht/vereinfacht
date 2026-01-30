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

function sRgbComponentToLinear(component: number): number {
    const normalized = component / 255;
    return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function getRelativeLuminanceFromHex(hexColor: string): number {
    const rgb = hexToRgb(hexColor);
    if (!rgb) {
        return 1;
    }
    const linearR = sRgbComponentToLinear(rgb.r);
    const linearG = sRgbComponentToLinear(rgb.g);
    const linearB = sRgbComponentToLinear(rgb.b);

    return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
}

export function contrastRatio(
    hexColorA: string,
    hexColorB: string = '#ffffff',
): number {
    const luminanceA = getRelativeLuminanceFromHex(hexColorA);
    const luminanceB = getRelativeLuminanceFromHex(hexColorB);

    const lighterLuminance = Math.max(luminanceA, luminanceB);
    const darkerLuminance = Math.min(luminanceA, luminanceB);

    return (lighterLuminance + 0.05) / (darkerLuminance + 0.05);
}

export function shouldUseDarkMode(primaryColor: string): boolean {
    const ratioWithWhite = contrastRatio(primaryColor, '#ffffff');
    return ratioWithWhite < 4.5;
}

export function getBrightnessFromHex(hex: string): number {
    const rgbObject = hexToRgb(hex);

    if (!rgbObject) {
        return 255;
    }

    return (299 * rgbObject.r + 587 * rgbObject.g + 114 * rgbObject.b) / 1000;
}

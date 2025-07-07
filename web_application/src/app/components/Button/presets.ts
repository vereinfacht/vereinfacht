export const BUTTON_BASE_CLASSES =
    'block leading-tight text-center relative transition-all';

export const BUTTON_SIZE_CLASSES = {
    default: 'rounded-md text-[1.0625rem] h-11 font-medium',
};

export const BUTTON_PRESETS = {
    primary:
        'px-9 bg-slate-400 text-slate-900 shadow-button transform hover:shadow-none hover:translate-y-[4px] disabled:shadow-button disabled:translate-y-0',
    secondary:
        'rounded-none px-4 text-slate-600 hover:text-slate-900 disabled:text-slate-600',
};

export type ButtonPresets = keyof typeof BUTTON_PRESETS;
export type ButtonSizes = keyof typeof BUTTON_SIZE_CLASSES;

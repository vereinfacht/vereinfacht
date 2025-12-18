export const BUTTON_BASE_CLASSES =
    'py-3 block leading-tight text-center relative transition-all';

export const BUTTON_SIZE_CLASSES = {
    default: 'rounded-md text-[1.0625rem] h-11 font-medium',
};

export const BUTTON_PRESETS = {
    primary:
        'px-9 bg-slate-400 text-slate-900 shadow-button transform hover:shadow-none hover:translate-y-[4px] disabled:shadow-button disabled:translate-y-0',
    secondary:
        'rounded-none px-4 text-slate-600 hover:text-slate-900 disabled:text-slate-600',
    destructive:
        'px-9 bg-red-400 text-white shadow-button shadow-red-500/50 transform hover:shadow-none hover:translate-y-[4px] disabled:shadow-button disabled:translate-y-0',
    outline:
        'px-4 text-blue-500 hover:bg-blue-500 hover:text-white disabled:text-slate-600 border-blue-500 border-2',
};

export type ButtonPresets = keyof typeof BUTTON_PRESETS;
export type ButtonSizes = keyof typeof BUTTON_SIZE_CLASSES;

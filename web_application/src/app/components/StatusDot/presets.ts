export const STATUS_DOT_PRESETS = {
    default: 'bg-blue-500 shadow-success shadow-blue-500/20',
    inactive: 'bg-slate-400',
    error: 'bg-red-500 shadow-success shadow-red-500/20',
    warning: 'bg-yellow-500 shadow-success shadow-yellow-500/30',
    success: 'bg-green-500 shadow-success',
};

export type StatusDotPreset = keyof typeof STATUS_DOT_PRESETS;

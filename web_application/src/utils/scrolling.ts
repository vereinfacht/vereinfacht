const isBrowser = () => typeof window !== 'undefined';

export function scrollToTop() {
    if (!isBrowser()) {
        return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

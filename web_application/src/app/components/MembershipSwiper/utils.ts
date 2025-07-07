export function customInjectStyles(element: HTMLElement, styles?: string) {
    const stylesElement = element.shadowRoot?.querySelector('style');

    if (!stylesElement) {
        return;
    }

    let stylesInner = stylesElement?.innerHTML;

    // prevents missing backdrop blur effect in firefox
    stylesInner += `
        :host(swiper-container) .swiper-wrapper { -moz-transform-style: flat !important; }
    `;

    if (Boolean(styles)) {
        stylesInner += styles;
    }

    stylesElement.innerHTML = stylesInner;
}

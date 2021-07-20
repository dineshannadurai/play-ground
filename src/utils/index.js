const getBreadcrumbLink = (pageDetail, isCurrentPage) => {
    const ariaCurrent = isCurrentPage ? "aria-current='page'" : "";
    return `
    <li>
        <a href="${pageDetail.link}" ${ariaCurrent}>
            ${pageDetail.name}
        </a>
    </li>`;
};

export const getBreadcrumb = (pages = []) => {
    return `
    <nav aria-label="Breadcrumb" class="breadcrumb">
        <ol>
            ${pages
                .map((page, index) => {
                    return getBreadcrumbLink(page, pages.length - 1 === index);
                })
                .join("")}
        </ol>
    </nav>`;
};

export const isMobileOrTablet = () => {
    const UserAgentParsed = window?.UAParser?.() || {};
    const { type = "" } = UserAgentParsed.device || {};
    return type === "mobile" || type === "tablet";
};

export const focusToNonFocusableEl = el => {
    if (el) {
        el.setAttribute('tabindex', '-1');
        const listner = () => {
            el.removeAttribute('tabindex');
            el.removeEventListener('blur', listner);
        };
        el.addEventListener('blur', listner);
        el.focus();
    }
};

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

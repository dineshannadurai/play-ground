import { getBreadcrumb } from "utils";

const pages = [
    { link: "#", name: "Home" },
    { link: "#upcoming", name: "Upcoming" },
    { link: "#declarative-shadow-dom", name: "Declarative Shadow DOM" },
];

export const template = `
<div>
    ${getBreadcrumb(pages)}
    <h1>Declarative Shadow DOM</h1>
    <custom-element>
        <template shadowroot="open">
            <slot></slot>
        </template>
        <h2>Testing Custom Element - Declarative Syntax</h2>
    </custom-element>
</div>
`;

export function initialize() {
    document.title = "Declarative Shadow DOM";
}

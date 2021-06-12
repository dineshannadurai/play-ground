export const template = `
    <custom-element>
        <template shadowroot="open">
            <slot></slot>
        </template>
        <h2>Testing Custom Element - Declarative Syntax</h2>
    </custom-element>
`;

export function initialize() {
    document.title = "Declarative Shadow DOM";
}

import { getBreadcrumb } from "utils";

const pages = [
    { link: "#", name: "Home" },
    { link: "#html-and-css", name: "HTML & CSS" },
    { link: "#html-and-css/html", name: "HTML" },
    { link: "#html-and-css/html/element-kinds", name: "Kinds of Elements" },
];

export const template = `
<div class="element-kinds contain-sub-list">
    ${getBreadcrumb(pages)}
    <h1>Kinds of Elements</h1>
    <ul>
        <li>
            Void elements
            <ul>
                <li>area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr</li>
            </ul>
        </li>
        <li>
            The template element
            <ul>
                <li>template</li>
            </ul>
        </li>
        <li>
            Raw text elements
            <ul>
                <li>script, style</li>
            </ul>
        </li>
        <li>
            Escapable raw text elements
            <ul>
                <li>textarea, title</li>
            </ul>
        </li>
        <li>
            Foreign elements
            <ul>
                <li>Elements from the MathML namespace and the SVG namespace.</li>
            </ul>
        </li>
        <li>
            Normal elements
            <ul>
                <li>All other allowed HTML elements are normal elements.</li>
            </ul>
        </li>
    </ul>
</div>
`;

export const initialize = () => {
    document.title = "Kinds of Elements : HTML Topics";
};

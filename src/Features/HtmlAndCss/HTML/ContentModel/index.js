import { getBreadcrumb } from "utils";
import "./index.css";

const pages = [
    { link: "#", name: "Home" },
    { link: "#html-and-css", name: "HTML & CSS" },
    { link: "#html-and-css/html", name: "HTML" },
    { link: "#html-and-css/html/content-model", name: "Content Model" },
];

export const template = `
<div class="content-model contain-sub-list">
    ${getBreadcrumb(pages)}
    <h1>Content Model</h1>
    <ul>
        <h2>Element Content categories</h2>
        <li>
            Metadata content
            <ul>
                <li>link, meta, style, title, ...etc.</li>
            </ul>
        </li>
        <li>
            Flow content
            <ul>
                <li>a, article, aside, br, button, div, footer, h1 to h6, header, img, input, label, 
                main, nav,script, section, select, small, span, strong, table, textarea, ul, ...etc.</li>
            </ul>
        </li>
        <li>
            Sectioning content
            <ul>
                <li>article, aside, nav, section</li>
            </ul>
        </li>
        <li>
            Heading content
            <ul>
                <li>h1, h2, h3, h4, h5, h6.</li>
            </ul>
        </li>
        <li>
            Phrasing content
            <ul>
                <li>a, br, button, img, input, label, script, select, small, span, strong, textarea, ...etc.</li>
            </ul>
        </li>
        <li>
            Embedded content
            <ul>
                <li>audio, canvas, iframe, img, picture, svg, video, ...etc.</li>
            </ul>
        </li>
        <li>
            Interactive content
            <ul>
                <li>a (if the href attribute is present), button, input(if the type attribute is not in the Hidden state), label, select, textarea, ...etc.</li>
            </ul>
        </li>
        <li>
            Sectioning roots
            <ul>
                <li>blockquote, body, details, dialog, fieldset, figure, td</li>
            </ul>
        </li>
        <li>
            Form-associated elements
            <ul>
                <li>listed, labelable, submittable, resettable, Autocapitalize-inheriting elements</li>
            </ul>
        </li>
        <li>
            Palpable content
        </li>
        <li>
            Script-supporting elements
            <ul>
                <li>script, template</li>
            </ul>
        </li>
    </ul>
    <ul>
        <h2>Others models</h2>
        <li>
            The "nothing" content model
        </li>
        <li>
            Transparent content models
        </li>
        <li>
            Paragraphs
        </li>
    </ul>
</div>
`;

export const initialize = () => {
    document.title = "Content Model : HTML Topics";
};

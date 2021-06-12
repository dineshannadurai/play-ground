import { getBreadcrumb } from "utils";
import "./index.css";

const pages = [
    { link: "#", name: "Home" },
    { link: "#html-and-css", name: "HTML & CSS" },
    { link: "#learn-css", name: "Learn CSS" },
    { link: "#learn-css/box-model", name: "Box Model" },
];

export const template = `
<div>
    ${getBreadcrumb(pages)}
    <h1>Box Model</h1>
    <p>Just writing a paragraph with quite number of characters that does not fit into the box.</p>
    <div class="block-container">
        <div class="block">Some text</div>
    </div>
</div>
`;

export const initialize = () => {
    document.title = "Box Model : Learn CSS";
};

import { getBreadcrumb } from "utils";
import "./index.css";

const pages = [
    { link: "#", name: "Home" },
    { link: "#learn-css", name: "Learn CSS" },
    { link: "#learn-css/cascade", name: "Cascade" },
];

export const template = `
    <div>
        ${getBreadcrumb(pages)}
        <h1>Cascading Rules</h1>
        <div>*order of list seen here will be Most specific to least specific</div>
        <ol>
            <li>
                Importance
                <ul>
                    <li>Transition</li>
                    <li>!important</li>
                    <li>Animation</li>
                    <li>Normal</li>
                </ul>
            </li>
            <li>Specificity</li>
            <li>
                Origin
                <ul>
                    <li>User agent Styles !important</li>
                    <li>User based styles !important</li>
                    <li>Authored CSS !important</li>
                    <li>Authored CSS</li>
                    <li>User based styles</li>
                    <li>User agent Styles</li>
                </ul>
            </li>
            <li>Position and Order of appearance</li>
        </ol>
    </div>
`;

export const initialize = () => {
    document.title = "Cascade : Learn CSS";
};

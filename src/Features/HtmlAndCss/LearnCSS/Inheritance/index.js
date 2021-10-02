import { getBreadcrumb } from "utils";
import "./index.css";

const pages = [
    { link: "#", name: "Home" },
    { link: "#html-and-css", name: "HTML & CSS" },
    { link: "#html-and-css/learn-css", name: "Learn CSS" },
    { link: "#html-and-css/learn-css/inheritance", name: "Inheritance" },
];

export const template = `
    <div>
        ${getBreadcrumb(pages)}
        <h1>Inheritance</h1>
        <div>
            <div class="inherit-parent">
                <div class="inherit-child"> 
                    <ul>
                        <li>BG - yellow</li>
                        <li>color - green</li>
                        <li>outline - red</li>
                    </ul>
                </div>
                <div class="inherit-child-1">
                    <ul>
                        <li>BG - yellow</li>
                        <li>color - set to initial</li>
                    </ul>
                </div>
                <div class="inherit-child-2">
                    <ul>
                        <li>BG - blue</li>
                        <li>color - black</li>
                        <li>outline - inherit</li>
                        <li>list-style - inherit</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
`;

export const initialize = () => {
    document.title = "Inheritance : Learn CSS";
};

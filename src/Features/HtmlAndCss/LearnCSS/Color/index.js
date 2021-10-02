import { getBreadcrumb } from "utils";
import "./index.css";

const pages = [
    { link: "#", name: "Home" },
    { link: "#html-and-css", name: "HTML & CSS" },
    { link: "#html-and-css/learn-css", name: "Learn CSS" },
    { link: "#html-and-css/learn-css/Color", name: "Color" },
];

export const template = `
    <div>
        ${getBreadcrumb(pages)}
        <h1>Color</h1>
        <div class="color-parent">
            <ul>
                <li>
                    Numeric Colors
                    <ul>
                        <li>
                            HEX - Hexadecimal color values
                            <ul>
                                <li>#RRGGBB, #RGB, #RRGGBBAA, #RGBA</li>
                                <li>R,G,B,A - hexa decimal values</li>
                            </ul>
                        </li>
                        <li>
                            RGB - Red Green Blue
                            <ul>
                                <li>rgb(R,G,B), rgb(R G B), rgb(R G B / A), rgba(R,G,B,A)</li>
                                <li>R,G,B - % or 0-255</li>
                                <li>A - % or 0-1</li>
                            </ul>
                        </li>
                        <li>
                            HSL - Hue Saturation Lightness
                            <ul>
                                <li>hsl(hue,saturation,lightness), hsl(h s l / alpha), hsla(h,s,l,a)</li>
                                <li>hue - degree or turns</li>
                                <li>saturation,lightness - %</li>
                                <li>alpha - % or 0-1</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    Color Keywords
                    <ul>
                        <li>Basic color keywords</li>
                        <li>Extended color keywords</li>
                        <li>"transparent" keyword</li>
                        <li>"currentColor" keyword</li>
                    </ul>
                </li>
            </ul>
            <h2>Used at</h2>
            <ul>
                <li>color, text-shadow, text-decoration-color</li>
                <li>background, background-color, linear-gradient</li>
                <li>border-color, outline-color, box-shadow</li>
            </ul>
        </div>
    </div>
`;

export const initialize = () => {
    document.title = "Color : Learn CSS";
};

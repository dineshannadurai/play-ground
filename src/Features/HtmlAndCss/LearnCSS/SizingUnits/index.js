import { getBreadcrumb } from "utils";
import "./index.css";

const pages = [
    { link: "#", name: "Home" },
    { link: "#html-and-css", name: "HTML & CSS" },
    { link: "#html-and-css/learn-css", name: "Learn CSS" },
    { link: "#html-and-css/learn-css/SizingUnits", name: "Sizing Units" },
];

export const template = `
    <div>
        ${getBreadcrumb(pages)}
        <h1>Sizing Units</h1>
        <div class="sizing-units-parent">
            <ul>
                <li>
                    Numbers
                    <ul>
                        <li>integer</li>
                        <li>number</li>
                    </ul>
                </li>
                <li>
                    Dimensions
                    <ul>
                        <li>
                            length
                            <ul>
                                <li>
                                    Font-relative lengths
                                        <q>cap, ch, em, ex, ic, lh, rem, rlh</q>
                                </li>
                                <li>
                                    Viewport-percentage lengths
                                        <q>vh, vw, vi, vb, vmin, vmax</q>
                                </li>
                                <li>
                                    Absolute length units
                                        <q>px, cm, mm, Q, in, pc, pt</q>
                                </li>
                            </ul>
                        </li>
                        <li>
                            angle
                                <q>deg, grad, rad, turn</q>
                        </li>
                        <li>
                            time
                                <q>s, ms</q>
                        </li>
                        <li>
                            resolution
                                <q>dpi, dpcm, dppx</q>
                        </li>
                    </ul>
                </li>
                <li>Percentages</li>
            </ul>
            <div class="sizing-units-ex">
                <div class="color-block px"></div>
                <div class="color-block cm"></div>
                <div class="color-block mm"></div>
                <div class="color-block in"></div>
                <div class="color-block pc"></div>
                <div class="color-block pt"></div>
                <div class="color-block vh"></div>
                <div class="color-block vw"></div>
                <div class="color-block vmax"></div>
                <div class="color-block vmin"></div>
                <div class="color-block ch"></div>
                <div class="color-block em"></div>
                <div class="color-block ex"></div>
                <div class="color-block rem"></div>
            </div>
        </div>
    </div>
`;

export const initialize = () => {
    document.title = "Sizing Units : Learn CSS";
};

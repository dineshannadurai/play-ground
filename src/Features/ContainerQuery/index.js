import image from "assets/mdn-images-object-fit.png";
import "./index.css";

export const template = `
<div class="cq-container">
    <div class="cq">
        <img src="${image}" width="200px" alt="image" />
        <div>This is some content to show some demo on the container queries.</div>
    </div>
</div>
`;

export function initialize() {
    document.title = "Container Queries";
}

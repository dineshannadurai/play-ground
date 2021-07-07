import { getBreadcrumb } from "utils";
import './customSelect';

const pages = [
    { link: "#", name: "Home" },
    { link: "#web-components", name: "Web Components" },
    { link: "#web-components/custom-elements", name: "Custom Elements" },
];

export const template = `
    <div>
        ${getBreadcrumb(pages)}
        <h1>Custom Elements</h1>
        <div>
            <custom-select id="custom-select">
                <custom-option >select</custom-option>
                <custom-option >I'm big one here.</custom-option>
                <custom-option >two</custom-option>
            </custom-select>
            <custom-select id="custom-select">
                <custom-option >select</custom-option>
                <custom-option >I'm big one here.</custom-option>
                <custom-option >two</custom-option>
            </custom-select>
            <select id="normal-select">
                <option>select</option>
                <option>I'm big one here.</option>
                <option>two</option>
            </select>
            <div>
                <form action="..." method="...">
                    <label>
                        <my-checkbox name="agreed" id='asd'></my-checkbox>
                         I read the agreement.
                    </label>
                    <input type="submit">
                </form>
            </div>
        </div>
    </div>
`;

export function initialize() {
    document.title = "Import Maps";
}

import { getBreadcrumb } from "utils";
import "./customSelect";
import "./index.css";

const pages = [
    { link: "#", name: "Home" },
    { link: "#web-components", name: "Web Components" },
    { link: "#web-components/custom-elements", name: "Custom Elements" },
];

const getRandomOptions = () => {
    const z = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
    ];
    return new Array(50).fill("").map(() => {
        return Array.from(
            (Number(Math.random()) * 100000000000000000).toString(),
        )
            .map(char => z[+char])
            .join("");
    });
};

const getOptHtml = (custom = false) => {
    return optArr
        .map(opt => {
            return `${custom ? "<custom-option>" : "<option>"}${opt}${
                custom ? "</custom-option>" : "</option>"
            }`;
        })
        .join("");
};

const optArr = getRandomOptions();
const opts = getRandomOptions();

export const template = `
    <div class="custom-elements">
        ${getBreadcrumb(pages)}
        <h1>Custom Elements</h1>
        <div>
            <template id="custom-select-template">          
                <style>
                    .btn-indigo {
                        @apply py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75;
                    }
                </style>
            </template>
            <h2>Custom Select</h2>
            <label for="custom-select">Select - More options</label>
            <custom-select required id="custom-select" data-template-id="custom-select-template">
                <custom-option >select</custom-option>
                <custom-option >I'm big one here.</custom-option>
                <custom-option >two</custom-option>
                ${getOptHtml(true)}
            </custom-select>
            <label for="custom-select-1">Select - Disabled</label>
            <custom-select disabled id="custom-select-1">
                <custom-option >select</custom-option>
                ${getOptHtml(true)}
            </custom-select>
            <label for="custom-select-2">Select - Less options</label>
            <custom-select id="custom-select-2">
                <custom-option >select</custom-option>
                <custom-option >I'm big one here.</custom-option>
                <custom-option >two</custom-option>
            </custom-select>
            <h2>HTML Native Select</h2>
            <div>
                <label for="normal-select-1">Select - More options</label>
                <select required id="normal-select-1">
                    <option>select</option>
                    <option>I'm big one here.</option>
                    <option>two</option>
                    ${getOptHtml()}
                </select>
            </div>
            <div>
                <label for="normal-select-2">Select - Disabled</label>
                <select disabled id="normal-select-2">
                    <option>select</option>
                    <option>I'm big one here.</option>
                    <option>two</option>
                </select>
            </div>
            <div>
                <label for="normal-select-3">Select - Less options</label>
                <select id="normal-select-3">
                    <option>select</option>
                    <option>I'm big one here.</option>
                    <option>two</option>
                </select>
            </div>
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

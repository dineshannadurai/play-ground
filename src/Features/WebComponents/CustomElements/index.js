import { getBreadcrumb } from "utils";
import "./customSelect";

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
    <div>
        ${getBreadcrumb(pages)}
        <h1>Custom Elements</h1>
        <div>
            <label for="custom-select">Select one</label>
            <template id="custom-select-template">          
                <style>
                    .btn-indigo {
                        @apply py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75;
                    }
                </style>
            </template>
            <custom-select id="custom-select" data-template-id="custom-select-template">
                <custom-option >select</custom-option>
                <custom-option >I'm big one here.</custom-option>
                <custom-option >two</custom-option>
                ${getOptHtml(true)}
            </custom-select>
            <label for="custom-select-1">Select two</label>
            <custom-select id="custom-select-1">
                <custom-option >select</custom-option>
                <custom-option >I'm big one here.</custom-option>
                <custom-option >two</custom-option>
                ${getOptHtml(true)}
            </custom-select>
            <label for="normal-select">Select three</label>
            <select id="normal-select">
                <option>select</option>
                <option>I'm big one here.</option>
                <option>two</option>
                ${getOptHtml()}
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

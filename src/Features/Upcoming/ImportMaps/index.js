import { add } from "utility";
import { getBreadcrumb } from "utils";

const pages = [
    { link: "#", name: "Home" },
    { link: "#upcoming", name: "Upcoming" },
    { link: "#import-maps", name: "Import Maps" },
];

export const template = `
    <div>
        ${getBreadcrumb(pages)}
        <h1>Import Maps</h1>
        <fieldset>
            <legend>Enter numbers to add</legend>
            <label>
                First number
                <input id="first-number" name="firstNumber" type="number" />
            </label>
            <label>
                Second number
                <input id="second-number" name="secondNumber" type="number" />
            </label>
            <button id="add-numbers" type="submit">Add</button>
            <div> Total : <span id="total">-</span></div>
        </fieldset>
    </div>
`;

export function initialize() {
    document.title = "Import Maps";
    const firstNumber = document.getElementById("first-number");
    const secondNumber = document.getElementById("second-number");
    const addBtn = document.getElementById("add-numbers");
    const totalSpan = document.getElementById("total");

    const numbers = {
        firstNumber: "",
        secondNumber: "",
    };

    const inputChangeHandler = e => {
        const { target } = e;
        const { name, value } = target;
        numbers[`${name}`] = value;
    };

    firstNumber.addEventListener("change", inputChangeHandler);
    secondNumber.addEventListener("change", inputChangeHandler);
    addBtn.addEventListener("click", () => {
        const sum = add(+numbers.firstNumber, +numbers.secondNumber);
        totalSpan.innerHTML = sum;
        console.log("Total", sum);
    });
}

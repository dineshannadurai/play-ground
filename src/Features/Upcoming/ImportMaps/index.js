import { add } from "utility";
import { getBreadcrumb } from "utils";

const pages = [
    { link: "#", name: "Home" },
    { link: "#upcoming", name: "Upcoming" },
    { link: "#upcoming/import-maps", name: "Import Maps" },
];

export const template = `
    <div>
        ${getBreadcrumb(pages)}
        <h1>Import Maps</h1>
        <div>
            <h2>
                Form 1
                <a href="#form-one">#</a>
            </h2>
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
                <div> Total : <output id="total" for="first-number second-number" >-</output></div>
            </fieldset>
            <h2>
                Form 2
                <a href="#form-two">#</a>
            </h2>
            <form>
                <fieldset>
                    <legend>Enter numbers to subtract</legend>
                    <label>
                        First number
                        <input id="first-number-sub" name="firstNumberSub" type="number" />
                    </label>
                    <label>
                        Second number
                        <input id="second-number-sub" name="secondNumberSub" type="number" />
                    </label>
                    <button id="sub-numbers" type="button" onclick=subResult.value=parseInt(firstNumberSub.value)-parseInt(firstNumberSub.value)>Subtract</button>
                    <div> Total : <output name="subResult" id="total-sub" for="first-number-sub second-number-sub" >-</output></div>
                </fieldset>
            </form>
        </div>
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

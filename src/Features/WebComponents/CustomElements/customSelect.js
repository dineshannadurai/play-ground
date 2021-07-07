import { isMobileOrTablet } from "utils";
import arrow from "assets/selectArrow.svg";

/**
 * CUSTOM OPTION ELEMENT
 */

class CustomOption extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Element functionality written in here
        console.log("self", this);
    }

    connectedCallback() {
        console.log("Custom option connectedCallback.");
    }

    disconnectedCallback() {
        console.log("Custom option disconnectedCallback");
    }

    adoptedCallback() {
        console.log("Custom option adoptedCallback");
    }

    attributeChangedCallback() {
        console.log("Custom option attributeChangedCallback");
    }
}

// #END

/**
 * CUSTOM OPTION LIST BOX ELEMENT
 */

class ListBox extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" });

        // Element functionality written in here
    }

    connectedCallback() {
        console.log("ListBox connectedCallback.");
    }

    disconnectedCallback() {
        console.log("ListBox disconnectedCallback");
    }

    adoptedCallback() {
        console.log("ListBox adoptedCallback");
    }

    attributeChangedCallback() {
        console.log("ListBox attributeChangedCallback");
    }
}

// #END

/**
 * CUSTOM SELECT ELEMENT
 */

class CustomSelect extends HTMLElement {
    static deviceListBoxId = 0;

    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" });

        // Element functionality written in here

        CustomSelect.deviceListBoxId += 1;
        this.deviceListBoxId = CustomSelect.deviceListBoxId;

        this.observerForOptionsChange = new MutationObserver(() => {
            console.log("MutationObserver");
            updateOptions(this);
        });

        constructSelectAndOptions(this.shadowRoot, this.deviceListBoxId);
        updateOptionDisplay(this.shadowRoot);
    }

    connectedCallback() {
        console.log("Custom connectedCallback.");
        updateOptions(this);
        this.observerForOptionsChange.observe(this, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
        });
    }

    disconnectedCallback() {
        console.log("Custom disconnectedCallback");
        this.observerForOptionsChange.disconnect();
    }

    adoptedCallback() {
        console.log("Custom adoptedCallback");
    }

    attributeChangedCallback() {
        console.log("Custom attributeChangedCallback");
    }
}

// #END

/**
 * DEFINING CUSTOM ELEMENTS CREATED
 */

customElements.define("custom-option", CustomOption);
customElements.define("custom-select", CustomSelect);
customElements.define("custom-list-box", ListBox);

// #END

/**
 * FUNCTIONS USED TO CONSTRUCT CUSTOM SELECT ELEMENT
 */

const getCustomOptions = customSelectEl => {
    return Array.from(customSelectEl.querySelectorAll("custom-option"));
};

const getUpdatedOptions = (options = []) => {
    return options
        .map(item => {
            return `
          <li class="custom-select-li">
            <a role="option" href="#option" tabindex="0" class="custom-select-anchor" >
              <span>${item.innerHTML}</span>
            </a>
          </li>
        `;
        })
        .join("");
};

const updateSelectWidth = shadowRootEl => {
    const optionsWidth = shadowRootEl
        .querySelector(".custom-select-list-container")
        ?.getBoundingClientRect()
        ?.width?.toFixed(2);
    const newStyleTag = document.createElement("style");
    newStyleTag.setAttribute("id", "custom-select-width");
    newStyleTag.textContent = `.dynamic-width{
        width: ${optionsWidth || 25}px;
    }`;

    const oldStyleTag = shadowRootEl.getElementById("custom-select-width");
    if (!!oldStyleTag) {
        shadowRootEl.replaceChild(newStyleTag, oldStyleTag);
    } else {
        const firstStyleTag = shadowRootEl.querySelector("style");
        shadowRootEl.insertBefore(newStyleTag, firstStyleTag);
    }
};

const updateOptions = customSelectEl => {
    const options = getCustomOptions(customSelectEl);
    const newList = getUpdatedOptions(options);
    customSelectEl.shadowRoot.querySelector(".custom-select-ul").innerHTML =
        newList;

    updateSelectWidth(customSelectEl.shadowRoot);
};

const createSelectButton = () => {
    const selectButton = document.createElement("button");
    selectButton.setAttribute("role", "combobox");
    selectButton.setAttribute("aria-haspopup", "listbox");
    selectButton.setAttribute("class", "custom-select-button dynamic-width");

    const buttonValue = document.createElement("span");
    selectButton.appendChild(buttonValue);

    return selectButton;
};

const createListContainer = (options = []) => {
    const listContainer = document.createElement("div");
    listContainer.setAttribute("class", "custom-select-list-container");

    const listBox = document.createElement("div");
    listBox.setAttribute("role", "listbox");
    listBox.setAttribute("tabindex", "-1");
    listBox.setAttribute("class", "custom-select-list-box");

    const ulElement = document.createElement("ul");
    ulElement.setAttribute("role", "presentation");
    ulElement.setAttribute("class", "custom-select-ul");

    options.forEach(item => {
        const liElement = document.createElement("li");
        liElement.setAttribute("class", "custom-select-li");

        const anchorElement = document.createElement("a");
        anchorElement.setAttribute("role", "option");
        anchorElement.setAttribute("href", "#option");
        anchorElement.setAttribute("tabindex", "0");
        anchorElement.setAttribute("class", "custom-select-anchor");

        const spanElement = document.createElement("span");
        spanElement.innerHTML = item.innerHTML;

        liElement.appendChild(anchorElement);
        ulElement.appendChild(liElement);
    });

    listBox.appendChild(ulElement);
    listContainer.appendChild(listBox);

    return listContainer;
};

const getBasicStyles = () => {
    return `

        * {
            margin: 0;
            height: 100%;
            box-sizing: border-box;
        }
        .custom-select-container {
            
            margin: 0;
            
            text-rendering: auto;
            text-transform: none;
            text-indent: 0px;
            text-shadow: none;
            text-align: start;
            
            letter-spacing: normal;
            word-spacing: normal;

            color: black;
            cursor: pointer;
            background: white;
        }

        .custom-select-button {
            display: inline-block;
            position: relative;
            padding: 0.0625rem 0.25rem;
            padding-right: 1.1rem;
            margin: 0;
            min-height: 1.5rem;

            font: inherit;

            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;

            background: url(${arrow});
            background-repeat: no-repeat;
            background-position: right 0.3rem top 50%;
            background-size: 0.5rem 0.5rem;

            background-color: #FFFFFF;
            
            appearance: menulist;
            align-items: center;
            white-space: pre;

            border-radius: 4%;
            border: 1px solid #00000080;
        }
        .custom-select-list-container {
            z-index: 100;
            
            visibility: hidden;
            position: absolute;
            width: fit-content;
            height: fit-content;
            margin: 0;

            border-radius: 0px;
            border: 1px solid black;
            background: white;

            // visibility: visible;
            // position: fixed;
            // width: 80vw;
            // margin: auto;
            // background: white;
            // inset: 0;
            // height: 50vh;
        }

        .custom-select-list-box {
            display: flex;
            flex-direction: column;
            max-height: 15rem;
        }

        .custom-select-ul {
            margin: 0;
            padding: 0;
        }

        .custom-select-li {
            list-style: none;
            text-align: left;
            margin: 0;
            height: auto;
        }

        .custom-select-anchor {
            padding: 0.0625rem 0.25rem;
            padding-right: 1.1rem;
            display: flex;
            align-items: center;
            color: inherit;
            text-decoration: none;
        }
        
        .custom-select-anchor:focus {
            background-clip: border-box;
            background-color: dodgerblue;
            outline: none;
        }

        .custom-select-anchor:focus span {
            color: white;
        }

        .custom-select-anchor:visited,
        .custom-select-anchor:hover,
        .custom-select-anchor:active {
            color: inherit;
        }
    `;
};

const constructSelectAndOptions = (shadowRootEl, deviceListBoxId) => {
    const selectContainer = document.createElement("div");
    selectContainer.setAttribute("class", "custom-select-container");

    const selectButton = createSelectButton();
    const listContainer = createListContainer();

    selectContainer.append(selectButton, listContainer);

    // Create basic CSS to apply to the shadow dom
    const style = document.createElement("style");
    style.textContent = getBasicStyles();

    // Will be removed - Inserted to check responsive
    const deviceDiv = document.createElement("div");
    deviceDiv.setAttribute("class", "custom-select-device-text-div");
    deviceDiv.textContent = isMobileOrTablet()
        ? "I'm a device"
        : "I'm not a device";

    shadowRootEl.append(style, deviceDiv, selectContainer);

    // Need to Create list box like a dialog
    const listBox = document.createElement("custom-list-box");
    listBox.setAttribute("data-custom-list-box-id", deviceListBoxId);
    // listBox.appendChild(listContainer);
    document.body.appendChild(listBox);
};

const updateOptionDisplay = shadowRootEl => {
    if (isMobileOrTablet() || window.matchMedia("(max-width: 767px)").matches) {
        console.log("update option UI");
        shadowRootEl.querySelector(
            ".custom-select-device-text-div",
        ).textContent = "I'm a device";
    } else {
        console.log("update option UI else part");
        shadowRootEl.querySelector(
            ".custom-select-device-text-div",
        ).textContent = "I'm not a device";
    }
    matchMedia("(max-width: 767px)").addEventListener(
        "change",
        updateOptionDisplay.bind(null, shadowRootEl),
        {
            once: true,
        },
    );
};

// #END

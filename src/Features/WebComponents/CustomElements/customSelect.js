import { isMobileOrTablet } from "utils";
import arrow from "assets/selectArrow.svg";

// KEYBOARD KEYS TO INTERACT

const SPACEBAR_KEY_CODE = " ";
const ENTER_KEY_CODE = "Enter";
const LEFT_ARROW_KEY_CODE = "ArrowLeft";
const UP_ARROW_KEY_CODE = "ArrowUp";
const RIGHT_ARROW_KEY_CODE = "ArrowRight";
const DOWN_ARROW_KEY_CODE = "ArrowDown";
const ESCAPE_KEY_CODE = "Escape";
const TAB_KEY_CODE = "Tab";

const BOOLEAN_ATTRIBUTE = ["disabled", "selected", "required"];

/**
 * CUSTOM OPTION ELEMENT
 */

class CustomOption extends HTMLElement {
    static get observedAttributes() {
        return ["label", "disabled", "selected", "value"];
    }

    constructor() {
        // Always call super first in constructor
        super();

        // Element functionality written in here
        console.log("self", this);
    }

    connectedCallback() {
        console.log("Custom option connectedCallback.");

        const allChilds = getCustomOptions(this.parentElement);
        this.index = allChilds.findIndex(child => child === this);

        this.label = this.getAttribute("label") ?? this.textContent;
        this.disabled = this.hasAttribute("disabled");
        this.selected = this.hasAttribute("selected");
        this.value = this.getAttribute("value") ?? this.textContent;
        this.text = this.textContent;

        this.parentElement.childConnectedCallback(this.index);
    }

    disconnectedCallback() {
        console.log("Custom option disconnectedCallback");
    }

    adoptedCallback() {
        console.log("Custom option adoptedCallback");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("Custom option attributeChangedCallback");
        updateCustomElAttribute(this, name, newValue);

        console.log(`${name}`, this[`${name}`]);
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
    static get observedAttributes() {
        return ["required", "disabled"];
    }

    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" });

        // Element functionality written in here

        CustomSelect.deviceListBoxId += 1;
        this.deviceListBoxId = CustomSelect.deviceListBoxId;

        // other member variables
        this.disabled = false;
        this.length = 0;
        this.required = false;
        this.selectedIndex = 0;
        this.value = "";
        this.stopSelectClick = false;
        this.isSelectMouseDown = false;

        this.isSearching = false;
        this.timer = null;
        this.searchText = "";
        this.repeatedCharAtStartSearchText = "";

        this.observerForOptionsChange = new MutationObserver(
            (mutationsList, observer) => {
                console.log("MutationObserver list", mutationsList);
                console.log("MutationObserver observer", observer);
                let isChildList = false;
                mutationsList.forEach(mutation => {
                    if (
                        !isChildList &&
                        (mutation.type === "childList" ||
                            (mutation.type === "characterData" &&
                                mutation.target.parentElement.tagName ===
                                    "CUSTOM-OPTION") ||
                            (mutation.type === "attributes" &&
                                mutation.target.tagName === "CUSTOM-OPTION"))
                    ) {
                        isChildList = true;
                        updateOptions(this);
                    }
                    if (
                        mutation.type === "attributes" &&
                        mutation.target.tagName === "CUSTOM-SELECT"
                    ) {
                        // do some operations
                    }
                });
            },
        );

        constructSelectAndOptions(this);
        updateOptionDisplay(this);
    }

    connectedCallback() {
        console.log("Custom connectedCallback.");
        const options = getCustomOptions(this);
        this.length = options.length;
        this.disabled = this.hasAttribute("disabled");
        this.required = this.hasAttribute("required");

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

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("Custom attributeChangedCallback");
        updateCustomElAttribute(this, name, newValue);
    }

    childConnectedCallback(childIndex) {
        if (this.length === childIndex + 1) updateOptions(this);
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

const updateCustomElAttribute = (customEl, name, newValue) => {
    if (BOOLEAN_ATTRIBUTE.includes(name)) {
        customEl[`${name}`] = customEl.hasAttribute(name);
    } else {
        customEl[`${name}`] = newValue;
    }
};

const getCustomOptions = customSelectEl => {
    return Array.from(customSelectEl?.querySelectorAll("custom-option") || []);
};

const getOptions = shadowRootEl => {
    return Array.from(
        shadowRootEl?.querySelectorAll(".custom-select-anchor") || [],
    );
};

const getSelectButton = shadowRootEl => {
    return shadowRootEl?.querySelector(".custom-select-button");
};

const getFirstStyleTag = shadowRootEl => {
    return shadowRootEl?.querySelector("style");
};

const getOptionsContainingUlTag = shadowRootEl => {
    return shadowRootEl?.querySelector(".custom-select-ul");
};

const addListnersForSelect = ({ selectButton, customSelectEl }) => {
    selectButton.addEventListener("click", onSelectClick.bind(customSelectEl));
    selectButton.addEventListener(
        "blur",
        onSelectAndOptionBlur.bind({ customSelectEl, isOption: false }),
    );
    selectButton.addEventListener(
        "keydown",
        onSelectKeyDown.bind(customSelectEl),
    );
    selectButton.addEventListener(
        "mousedown",
        onSelectMouseDown.bind(customSelectEl),
    );
};

const addListnersForOption = ({ option, customSelectEl }) => {
    option.addEventListener("click", onOptionClick.bind(customSelectEl));
    option.addEventListener("keydown", onOptionKeyDown.bind(customSelectEl));
    option.addEventListener(
        "blur",
        onSelectAndOptionBlur.bind({ customSelectEl, isOption: true }),
    );
    option.addEventListener(
        "mouseenter",
        onOptionMouseEnter.bind(customSelectEl),
    );
    option.addEventListener(
        "dragstart",
        onOptionMouseDragStart.bind(customSelectEl),
    );
};

const attachListnersForAllOptions = customSelectEl => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
    const options = getOptions(shadowRootEl);
    options.forEach(option => {
        addListnersForOption({ option, customSelectEl });
    });
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
    const listContainer = getListContainer(shadowRootEl);
    const optionsWidth = listContainer
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
        const firstStyleTag = getFirstStyleTag(shadowRootEl);
        shadowRootEl.insertBefore(newStyleTag, firstStyleTag);
    }
};

const updateOptions = customSelectEl => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
    const options = getCustomOptions(customSelectEl);
    let selectedIndex = 0;

    options.forEach((option, index) => {
        if (option.selected) selectedIndex = index;
    });

    customSelectEl.selectedIndex = selectedIndex;
    customSelectEl.value = options[selectedIndex].value;
    updateSelectValue({ shadowRootEl, value: customSelectEl.value });

    const newList = getUpdatedOptions(options);
    const listParent = getOptionsContainingUlTag(shadowRootEl);
    listParent.innerHTML = newList;
    attachListnersForAllOptions(customSelectEl);
    updateSelectWidth(shadowRootEl);
};

const getListContainer = shadowRootEl => {
    return shadowRootEl?.querySelector(".custom-select-list-container");
};

const getListContainerVisibility = shadowRootEl => {
    const listContainer = getListContainer(shadowRootEl);
    return listContainer?.style?.visibility;
};

const setListContainerVisibility = ({ shadowRootEl, value }) => {
    const listContainer = getListContainer(shadowRootEl);
    listContainer.style.visibility = value;
};

const isListContainerOpen = shadowRootEl => {
    return getListContainerVisibility(shadowRootEl) === "visible";
};

const toggleListOption = customSelectEl => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
    const isListOpen = isListContainerOpen(shadowRootEl);
    if (isListOpen) {
        setListContainerVisibility({
            shadowRootEl,
            value: "hidden",
        });
    } else {
        setListContainerVisibility({
            shadowRootEl,
            value: "visible",
        });
        focusSelectedOption(customSelectEl);
    }
};

const getIndexOnArrowKey = ({ index, length, code }) => {
    let nextIndex = -1;
    if (code === DOWN_ARROW_KEY_CODE || code === RIGHT_ARROW_KEY_CODE) {
        if (index < length - 1) {
            nextIndex = index + 1;
        } else {
            nextIndex = 0;
        }
    } else if (code === UP_ARROW_KEY_CODE || code === LEFT_ARROW_KEY_CODE) {
        if (index > 0) {
            nextIndex = index - 1;
        } else {
            nextIndex = length - 1;
        }
    }
    return nextIndex;
};

const focusSelectedOption = customSelectEl => {
    const { selectedIndex = 0 } = customSelectEl;
    focusOption({ customSelectEl, index: selectedIndex });
};

const focusOption = ({ customSelectEl, index }) => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
    const options = getOptions(shadowRootEl);
    const selectedOption = options[index];
    selectedOption.focus();
};

const updateCustomOptionSelected = ({ customSelectEl, selectedIndex }) => {
    const customOptions = getCustomOptions(customSelectEl);
    customOptions.forEach((option, index) => {
        if (index === selectedIndex) option.selected = true;
        else option.selected = false;
    });
};

function onSelectMouseDown(e) {
    const customSelectEl = this;
    customSelectEl.isSelectMouseDown = true;
}

function onSelectClick() {
    const customSelectEl = this;
    const { stopSelectClick } = customSelectEl;
    const disabled = false;
    if (!disabled && !stopSelectClick) {
        // enableFocus(refs);
        toggleListOption(customSelectEl);
    }
    customSelectEl.isSelectMouseDown = false;
    customSelectEl.stopSelectClick = false;
}

function onSelectKeyDown(e) {
    const customSelectEl = this;
    const { shadowRoot: shadowRootEl, selectedIndex, length } = customSelectEl;
    const openDropDown =
        e.key === SPACEBAR_KEY_CODE || e.key === ENTER_KEY_CODE;
    const selectOption =
        e.key === UP_ARROW_KEY_CODE ||
        e.key === DOWN_ARROW_KEY_CODE ||
        e.key === RIGHT_ARROW_KEY_CODE ||
        e.key === LEFT_ARROW_KEY_CODE;
    if (openDropDown) {
        e.preventDefault();
        toggleListOption(customSelectEl);
    } else if (selectOption) {
        e.preventDefault();
        const newIndex = getIndexOnArrowKey({
            index: selectedIndex,
            length,
            code: e.key,
        });
        if (newIndex !== -1) {
            customSelectEl.selectedIndex = newIndex;
            const selectedOption = getSelectedCustomOption({
                customSelectEl,
                selectedIndex: newIndex,
            });
            updateCustomOptionSelected({
                customSelectEl,
                selectedIndex: newIndex,
            });
            customSelectEl.value = selectedOption.value;
            updateSelectValue({ shadowRootEl, value: customSelectEl.value });
        }
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        // searching logic starts
        searchOption({
            searchKey: e.key,
            customSelectEl,
        });
    }
}

function onSelectAndOptionBlur(e) {
    const { customSelectEl, isOption } = this;
    const { shadowRoot: shadowRootEl, isSelectMouseDown } = customSelectEl;
    const nextFocusedEl = e.relatedTarget || document.activeElement;
    const optionList = getOptions(shadowRootEl);
    const selectButton = getSelectButton(shadowRootEl);
    const isOptionMenu = optionList.some(item => item === nextFocusedEl);
    if (isOption && !isOptionMenu) {
        setListContainerVisibility({
            shadowRootEl,
            value: "hidden",
        });
        // enableFocus(refs);
    }
    if (nextFocusedEl !== selectButton && !isOptionMenu) {
        // onBlur(e);
    }

    if (isSelectMouseDown && nextFocusedEl === selectButton) {
        customSelectEl.stopSelectClick = true;
    }
}

const getSelectedOptionIndex = ({ shadowRootEl, targetEl }) => {
    const options = getOptions(shadowRootEl);
    return options.findIndex(option => option === targetEl);
};

const getSelectedCustomOption = ({ customSelectEl, selectedIndex }) => {
    const customOptions = getCustomOptions(customSelectEl);
    return customOptions[selectedIndex];
};

const updateSelectValue = ({ shadowRootEl, focusSelect = false, value }) => {
    const selectButton = getSelectButton(shadowRootEl);
    selectButton.children[0].textContent = value;
    if (focusSelect) selectButton.focus();
};

function onOptionMouseDragStart(e) {
    e.preventDefault();
}

function onOptionClick(e) {
    const customSelectEl = this;
    const { shadowRoot: shadowRootEl } = customSelectEl;
    e.preventDefault();
    const selectedIndex = getSelectedOptionIndex({
        shadowRootEl,
        targetEl: e.currentTarget,
    });
    customSelectEl.selectedIndex = selectedIndex;
    const selectedOption = getSelectedCustomOption({
        customSelectEl,
        selectedIndex,
    });
    updateCustomOptionSelected({
        customSelectEl,
        selectedIndex,
    });
    const { value: selectedValue } = selectedOption;
    customSelectEl.value = selectedValue;
    updateSelectValue({
        shadowRootEl,
        focusSelect: true,
        value: selectedValue,
    });
    setListContainerVisibility({
        shadowRootEl,
        value: "hidden",
    });
    // enableFocus(refs);
}

const focusNextOption = ({ index, length, code, customSelectEl }) => {
    const newIndex = getIndexOnArrowKey({
        index,
        length,
        code,
    });
    if (newIndex !== -1) {
        focusOption({ customSelectEl, index: newIndex });
    }
};

function onOptionKeyDown(e) {
    const customSelectEl = this;
    const { shadowRoot: shadowRootEl, length } = customSelectEl;
    e.preventDefault();
    const index = getSelectedOptionIndex({
        shadowRootEl,
        targetEl: e.currentTarget,
    });
    switch (e.key) {
        case ENTER_KEY_CODE:
            onOptionClick.bind(customSelectEl)(e);
            break;

        case DOWN_ARROW_KEY_CODE:
        case LEFT_ARROW_KEY_CODE:
        case UP_ARROW_KEY_CODE:
        case RIGHT_ARROW_KEY_CODE:
            focusNextOption({
                index,
                length,
                code: e.key,
                customSelectEl,
            });
            break;

        case ESCAPE_KEY_CODE:
        case TAB_KEY_CODE:
            setListContainerVisibility({
                shadowRootEl,
                value: "hidden",
            });
            // enableFocus(refs);
            const selectButton = getSelectButton(shadowRootEl);
            selectButton.focus();
            break;

        default:
            break;
    }

    // searching logic starts
    if (/^[a-zA-Z]$/.test(e.key)) {
        searchOption({
            searchKey: e.key,
            customSelectEl,
        });
    }
}

function onOptionMouseEnter(e) {
    const customSelectEl = this;
    const { shadowRoot: shadowRootEl } = customSelectEl;
    e.preventDefault();
    const index = getSelectedOptionIndex({
        shadowRootEl,
        targetEl: e.currentTarget,
    });
    focusOption({ customSelectEl, index });
}

const createSelectButton = customSelectEl => {
    const selectButton = document.createElement("button");
    selectButton.setAttribute("role", "combobox");
    selectButton.setAttribute("aria-haspopup", "listbox");
    selectButton.setAttribute("class", "custom-select-button dynamic-width");
    addListnersForSelect({ selectButton, customSelectEl });

    const buttonValue = document.createElement("span");
    selectButton.appendChild(buttonValue);

    return selectButton;
};

const setTimer = ({ customSelectEl }) => {
    customSelectEl.timer = setTimeout(() => {
        customSelectEl.searchText = "";
        customSelectEl.repeatedCharAtStartSearchText = "";
        customSelectEl.isSearching = false;
        customSelectEl.timer = null;
    }, 1000);
};

const getNextSearchIndex = ({ index, length }) => {
    if (index !== -1 && index < length - 1) {
        return index + 1;
    }
    return 0;
};

const getUpdatedSearchText = ({ customSelectEl, searchKey }) => {
    return customSelectEl.repeatedCharAtStartSearchText
        ? customSelectEl.repeatedCharAtStartSearchText + searchKey
        : customSelectEl.searchText + searchKey;
};

const UpdateSearchTimeoutAndText = ({ customSelectEl, searchKey }) => {
    if (customSelectEl.isSearching) {
        if (searchKey !== customSelectEl.searchText) {
            customSelectEl.searchText = getUpdatedSearchText({
                customSelectEl,
                searchKey,
            });
            customSelectEl.repeatedCharAtStartSearchText = "";
            clearTimeout(customSelectEl.timer);
            customSelectEl.timer = null;
            setTimer({ customSelectEl });
        } else {
            const repeatedCharAtStart = getUpdatedSearchText({
                customSelectEl,
                searchKey,
            });
            customSelectEl.repeatedCharAtStartSearchText = repeatedCharAtStart;
        }
    } else {
        customSelectEl.isSearching = true;
        customSelectEl.searchText = getUpdatedSearchText({
            customSelectEl,
            searchKey,
        });
        setTimer({ customSelectEl });
    }
};

const searchOption = ({ customSelectEl, searchKey }) => {
    const { shadowRoot: shadowRootEl, selectedIndex } = customSelectEl;

    UpdateSearchTimeoutAndText({ customSelectEl, searchKey });

    const customOptions = getCustomOptions(customSelectEl);

    const isOpen = isListContainerOpen(shadowRootEl);
    const currentIndex = isOpen
        ? getSelectedOptionIndex({
              shadowRootEl,
              targetEl: shadowRootEl.activeElement,
          })
        : selectedIndex;
    const currentItem = customOptions[+currentIndex];
    const filteredList = customOptions.filter(item =>
        item.value
            .toLowerCase()
            .startsWith(customSelectEl.searchText.toLowerCase()),
    );
    if (filteredList.length && currentItem) {
        const currentItemIndexInFilteredList = filteredList.findIndex(
            item => item.value === currentItem.value,
        );
        const nextIndex = getNextSearchIndex({
            index: currentItemIndexInFilteredList,
            length: filteredList.length,
        });
        const nextItem = filteredList[+nextIndex];
        const originalIndex = customOptions.findIndex(
            item => item.value === nextItem.value,
        );
        if (isOpen) {
            focusOption({ customSelectEl, index: originalIndex });
        } else if (originalIndex !== selectedIndex) {
            customSelectEl.selectedIndex = originalIndex;
            customSelectEl.value = customOptions[originalIndex].value;
            updateSelectValue({ shadowRootEl, value: customSelectEl.value });
        }
    }
};

const createListContainer = (customSelectEl, options = []) => {
    const listContainer = document.createElement("div");
    listContainer.setAttribute("class", "custom-select-list-container");
    listContainer.style.visibility = "hidden";

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
        addListnersForOption({ option: anchorElement, customSelectEl });

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
            background: white;
        }

        .custom-select-button {
            display: inline-flex;
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
            cursor: pointer;
        }
        .custom-select-list-container {
            z-index: 100;

            position: absolute;
            width: fit-content;
            height: fit-content;
            margin: 0;

            border-radius: 0px;
            border: 1px solid black;
            background: white;
            overflow-y: scroll;

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

const constructSelectAndOptions = customSelectEl => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
    const selectContainer = document.createElement("div");
    selectContainer.setAttribute("class", "custom-select-container");

    const selectButton = createSelectButton(customSelectEl);
    const listContainer = createListContainer(customSelectEl);

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

    const templateId = customSelectEl.getAttribute("data-template-id");
    const styleTemplate = document.getElementById(templateId || "");
    const styleTag = styleTemplate ? styleTemplate.content.cloneNode(true) : "";

    shadowRootEl.append(style, styleTag, deviceDiv, selectContainer);

    // Need to Create list box like a dialog
    const listBox = document.createElement("custom-list-box");
    listBox.setAttribute(
        "data-custom-list-box-id",
        customSelectEl.deviceListBoxId,
    );
    // listBox.appendChild(listContainer);
    document.body.appendChild(listBox);
};

const updateOptionDisplay = customSelectEl => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
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
        updateOptionDisplay.bind(null, customSelectEl),
        {
            once: true,
        },
    );
};

// #END

import { isMobileOrTablet } from "utils";
import arrow from "assets/selectArrow.svg";
import { focusFirstFocusableEl, focusLastFocusableEl } from "./dialog.js";

// KEYBOARD KEYS TO INTERACT

const SPACEBAR_KEY_CODE = " ";
const ENTER_KEY_CODE = "Enter";
const LEFT_ARROW_KEY_CODE = "ArrowLeft";
const UP_ARROW_KEY_CODE = "ArrowUp";
const RIGHT_ARROW_KEY_CODE = "ArrowRight";
const DOWN_ARROW_KEY_CODE = "ArrowDown";
const ESCAPE_KEY_CODE = "Escape";
const TAB_KEY_CODE = "Tab";
const HOME_KEY_CODE = "Home";
const END_KEY_CODE = "End";
const PAGE_UP_KEY_CODE = "PageUp";
const PAGE_DOWN_KEY_CODE = "PageDown";

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
        constructOptionsModal(this);
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

    updateMenuOptions({ customSelectEl, options }) {
        this.customSelectEl = customSelectEl;
        this.options = options;

        const newList = getUpdatedMenuOptions({ options });
        const listParent = getOptionsContainingUlTag(this.shadowRoot);
        listParent.innerHTML = newList;
        attachListnersForAllMenuOptions(this);
    }
}

const getUpdatedMenuOptions = ({ options = [] }) => {
    return options
        .map((item, index) => {
            return `
          <li class="custom-select-li">
            <a 
                role="option" 
                href="#option" 
                tabindex="0"
                class="custom-select-anchor" 
                aria-setsize="${options.length}" 
                aria-posinset="${index + 1}"
            >
              <span>${item.innerHTML}</span>
              <span class="custom-option-check"></span>
            </a>
          </li>
        `;
        })
        .join("");
};

function onMenuOptionClick(e) {
    const customListBoxEl = this;
    const { shadowRoot: shadowRootEl, customSelectEl } = customListBoxEl;
    e.preventDefault();
    e.stopPropagation();
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
        shadowRootEl: customSelectEl.shadowRoot,
        focusSelect: true,
        value: selectedValue,
    });
    toggleDeviceOptions(customSelectEl);
}

const addListnersForMenuOption = ({ option, customListBoxEl }) => {
    option.addEventListener("click", onMenuOptionClick.bind(customListBoxEl));
};

const attachListnersForAllMenuOptions = customListBoxEl => {
    const { shadowRoot: shadowRootEl } = customListBoxEl;
    const options = getOptions(shadowRootEl);
    options.forEach(option => {
        addListnersForMenuOption({ option, customListBoxEl });
    });
};

const constructOptionsModal = customListBoxEl => {
    const { shadowRoot: shadowRootEl } = customListBoxEl;

    // Create basic CSS to apply to the shadow dom
    const style = document.createElement("style");
    style.textContent = getOptionModalBasicStyles();

    const modal = createModal(customListBoxEl);
    const menuList = createMenuList();
    const postNode = modal.querySelector('[data-node="post"]');
    modal.insertBefore(menuList, postNode);

    shadowRootEl.append(style, modal);
};

const createMenuList = (options = []) => {
    const listBox = document.createElement("div");
    listBox.setAttribute("class", "custom-option-list-box");

    const ulElement = document.createElement("ul");
    ulElement.setAttribute("role", "listbox");
    ulElement.setAttribute("class", "custom-select-ul");
    ulElement.setAttribute("tabindex", "-1");

    options.forEach(item => {
        const liElement = document.createElement("li");
        liElement.setAttribute("role", "none");
        liElement.setAttribute("class", "custom-select-li");

        const anchorElement = document.createElement("a");
        anchorElement.setAttribute("role", "menuitemradio");
        anchorElement.setAttribute("href", "#option");
        anchorElement.setAttribute("tabindex", "0");
        anchorElement.setAttribute("class", "custom-select-anchor");

        const spanElement = document.createElement("span");
        spanElement.innerHTML = item.innerHTML;

        const checkSpanElement = document.createElement("span");

        anchorElement.append(spanElement, checkSpanElement);

        liElement.appendChild(anchorElement);
        ulElement.appendChild(liElement);
    });

    listBox.appendChild(ulElement);

    return listBox;
};

const getOptionModalBasicStyles = () => {
    return `
        .custom-option-backdrop {
            background: rgba(0, 0, 0, 0.6);
            position: fixed;
            overflow-y: auto;
            inset: 0;
            z-index: 9999;
        }
        .custom-option-list-box {
            font-size: clamp(1.5rem, 2.5vw, 2.5rem);
            position: fixed;
            max-width: 90vw;
            max-height: 90vh;
            height: fit-content;
            inset: 0;
            margin: auto;
            overflow-y: auto;
            color: white;
            border-radius: 0.5rem;
            background-color: #353639;
        }
        @media (orientation: landscape) {
            .custom-option-list-box {
                max-width: 60vw;
            }
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
            border-bottom: 1px solid #404245;
        }
        .custom-select-li:last-child {
            border-bottom: none;
        }
        .custom-select-anchor {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: inherit;
            text-decoration: none;
            padding: 1rem;
            word-break: break-all;
        }
        .custom-select-anchor:focus {
            background-color: #434448;
            outline: none;
        }
        li:first-child a:focus {
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
        }
        li:last-child a:focus {
            border-bottom-right-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
        }
        .custom-option-check {
            min-width: 0.5rem;
            min-height: 0.5rem;
            border-radius: 100%;
            position: relative;
            box-shadow: 0 0 0 0.125rem #7a7b7f;
            border: 0.125rem solid #353639;
        }
        .custom-select-anchor:focus .custom-option-check {
            border: 0.125rem solid #434448;
        }
        .custom-select-anchor[aria-checked='true'] .custom-option-check {
            background-color: #84acf0;
            box-shadow: 0 0 0 0.125rem #84acf0;
        }
    `;
};

const createModal = customListBoxEl => {
    const backDrop = document.createElement("div");
    backDrop.setAttribute("class", "custom-option-backdrop");
    backDrop.style.display = "none";

    backDrop.addEventListener("click", () => {
        const { customSelectEl } = customListBoxEl;
        toggleDeviceOptions(customSelectEl);
    });

    customListBoxEl.preNode = document.createElement("div");
    customListBoxEl.preNode.setAttribute("data-node", "pre");

    customListBoxEl.preNode.addEventListener("focus", () => {
        focusLastFocusableEl(customListBoxEl.preNode.nextSibling);
    });

    customListBoxEl.postNode = document.createElement("div");
    customListBoxEl.postNode.setAttribute("data-node", "post");

    customListBoxEl.postNode.addEventListener("focus", () => {
        focusFirstFocusableEl(customListBoxEl.postNode.previousSibling);
    });

    backDrop.append(customListBoxEl.preNode, customListBoxEl.postNode);
    return backDrop;
};

// #END

/**
 * CUSTOM SELECT ELEMENT
 */

class CustomSelect extends HTMLElement {
    static listBoxId = 0;
    static get observedAttributes() {
        return ["required", "disabled"];
    }

    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" });

        // Element functionality written in here

        CustomSelect.listBoxId += 1;
        this.listBoxId = CustomSelect.listBoxId;

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

        this.customListBoxEl = null;
        this.isDevice = false;

        updateCustomSelectElProperties(this);

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
        updateOptionDisplay(this);
        constructSelectAndOptions(this);
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

    focus() {
        const select = getSelectButton(this.shadowRoot);
        select.focus();
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

const updateCustomSelectElProperties = customSelectEl => {
    for (let name of customSelectEl.getAttributeNames()) {
        const value = customSelectEl.getAttribute(name);
        updateCustomElAttribute(customSelectEl, name, value);
    }
};

const updateCustomElAttribute = (customEl, name, newValue) => {
    if (BOOLEAN_ATTRIBUTE.includes(name)) {
        customEl[`${name}`] = customEl.hasAttribute(name);
    } else if (name.includes("aria-")) {
        const propValue = name.replace(/-\w/, (match, offset, string) => {
            return string[offset + 1].toUpperCase();
        });
        customEl[`${propValue}`] = newValue;
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

const getUpdatedOptions = ({ options = [], selectedIndex, listBoxId }) => {
    return options
        .map((item, index) => {
            return `
          <li class="custom-select-li">
            <a role="option" href="#option" id="listbox-${listBoxId}-option-${
                index + 1
            }" tabindex="0" aria-selected="${
                index === selectedIndex
            }" aria-setsize="${options.length}" aria-posinset="${
                index + 1
            }" class="custom-select-anchor" >
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
    const {
        shadowRoot: shadowRootEl,
        customListBoxEl,
        listBoxId,
    } = customSelectEl;
    const options = getCustomOptions(customSelectEl);
    let selectedIndex = 0;

    options.forEach((option, index) => {
        if (option.selected) selectedIndex = index;
    });

    customSelectEl.selectedIndex = selectedIndex;
    customSelectEl.value = options[selectedIndex].value;
    updateSelectValue({ shadowRootEl, value: customSelectEl.value });

    const newList = getUpdatedOptions({ options, selectedIndex, listBoxId });
    const listParent = getOptionsContainingUlTag(shadowRootEl);
    listParent.innerHTML = newList;
    attachListnersForAllOptions(customSelectEl);
    updateSelectWidth(shadowRootEl);

    customListBoxEl.updateMenuOptions({ customSelectEl, options });
};

const getListBox = shadowRootEl => {
    return shadowRootEl?.querySelector(".custom-select-list-box");
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

const setAttrAndUpdateProp = ({ customSelectEl, target, name, value }) => {
    target.setAttribute(name, value);
    updateCustomElAttribute(customSelectEl, name, value);
};

const updateOptionsListVisibility = ({ customSelectEl, value }) => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
    setListContainerVisibility({
        shadowRootEl,
        value,
    });
    const selectButton = getSelectButton(shadowRootEl);
    setAttrAndUpdateProp({
        customSelectEl,
        target: selectButton,
        name: "aria-expanded",
        value: value === "visible",
    });
};

const isListContainerOpen = shadowRootEl => {
    return getListContainerVisibility(shadowRootEl) === "visible";
};

const getMenuListDialog = shadowRootEl => {
    return shadowRootEl?.querySelector(".custom-option-backdrop");
};

const getMenuListDialogDisplay = shadowRootEl => {
    const listContainer = getMenuListDialog(shadowRootEl);
    return listContainer?.style?.display;
};

const setMenuListDialogDisplay = ({ shadowRootEl, value }) => {
    const listContainer = getMenuListDialog(shadowRootEl);
    listContainer.style.display = value;
};

const isMenuListDialogOpen = shadowRootEl => {
    return getMenuListDialogDisplay(shadowRootEl) !== "none";
};

const focusSelectedMenuOption = (customSelectEl, customListBoxEl) => {
    const { selectedIndex = 0 } = customSelectEl;
    const { shadowRoot: shadowRootEl } = customListBoxEl;
    const options = getOptions(shadowRootEl);
    const selectedOption = options[selectedIndex];
    options.forEach(option => {
        option.setAttribute("aria-checked", "false");
        option.setAttribute("aria-selected", "false");
    });
    selectedOption.setAttribute("aria-checked", "true");
    selectedOption.focus();
};

const onDialogShow = ({ customListBoxEl, focusCB }) => {
    document.body.style.overflow = "hidden";

    customListBoxEl.prevFocusedEl = document.activeElement;
    customListBoxEl.preNode.tabIndex = 0;
    customListBoxEl.postNode.tabIndex = 0;

    // set focus on first input
    if (typeof focusCB === "function") focusCB();

    [].slice.call(document.body.children).forEach(node => {
        if (node !== customListBoxEl) {
            node.setAttribute("inert", "true");
        }
    });
};

const onDialogHide = ({ customListBoxEl }) => {
    const isOverflowHiddenForBody = document.body.style.overflow === "hidden";
    if (isOverflowHiddenForBody) document.body.style.overflow = "";
    customListBoxEl.preNode.removeAttribute("tabindex");
    customListBoxEl.postNode.removeAttribute("tabindex");
    [].slice.call(document.body.children).forEach(node => {
        const el = node;
        const isHidden = el.hasAttribute("inert");
        if (isHidden) {
            el.inert = false;
        }
    });

    if (customListBoxEl.prevFocusedEl) {
        customListBoxEl.prevFocusedEl.focus();
        customListBoxEl.prevFocusedEl = null;
    }
};

const toggleDeviceOptions = customSelectEl => {
    const { customListBoxEl, shadowRoot: customSelectShadowRootEl } =
        customSelectEl;
    const { shadowRoot: shadowRootEl } = customListBoxEl;
    const isListOpen = isMenuListDialogOpen(shadowRootEl);
    const selectButton = getSelectButton(customSelectShadowRootEl);
    if (isListOpen) {
        onDialogHide({ customListBoxEl });
        setMenuListDialogDisplay({
            shadowRootEl,
            value: "none",
        });
        setAttrAndUpdateProp({
            customSelectEl,
            target: selectButton,
            name: "aria-expanded",
            value: false,
        });
    } else {
        onDialogShow({
            customListBoxEl,
            focusCB: () => {
                setMenuListDialogDisplay({
                    shadowRootEl,
                    value: "block",
                });
                focusSelectedMenuOption(customSelectEl, customListBoxEl);
            },
        });
        setAttrAndUpdateProp({
            customSelectEl,
            target: selectButton,
            name: "aria-expanded",
            value: true,
        });
    }
};

const toggleDesktopOptions = customSelectEl => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
    const isListOpen = isListContainerOpen(shadowRootEl);
    if (isListOpen) {
        updateOptionsListVisibility({
            customSelectEl,
            value: "hidden",
        });
    } else {
        updateOptionsListVisibility({
            customSelectEl,
            value: "visible",
        });
        focusSelectedOption(customSelectEl);
    }
};

const toggleListOption = customSelectEl => {
    if (customSelectEl.isDevice) {
        toggleDeviceOptions(customSelectEl);
    } else {
        toggleDesktopOptions(customSelectEl);
    }
};

const getIndexOnArrowKey = ({ index, length, code }) => {
    let nextIndex = -1;
    const firstIndex = 0;
    const lastIndex = length - 1;
    if (code === DOWN_ARROW_KEY_CODE || code === RIGHT_ARROW_KEY_CODE) {
        if (index < lastIndex) {
            nextIndex = index + 1;
        } else {
            nextIndex = firstIndex;
        }
    } else if (code === UP_ARROW_KEY_CODE || code === LEFT_ARROW_KEY_CODE) {
        if (index > firstIndex) {
            nextIndex = index - 1;
        } else {
            nextIndex = lastIndex;
        }
    } else if (code === HOME_KEY_CODE || code === PAGE_UP_KEY_CODE) {
        nextIndex = firstIndex;
    } else if (code === END_KEY_CODE || code === PAGE_DOWN_KEY_CODE) {
        nextIndex = lastIndex;
    }
    return nextIndex;
};

const focusSelectedOption = customSelectEl => {
    const { selectedIndex = 0 } = customSelectEl;
    focusOption({ customSelectEl, index: selectedIndex, updateAria: true });
};

const updateOptionAria = ({ customSelectEl, selectedIndex }) => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
    const options = getOptions(shadowRootEl);
    options.forEach((option, index) => {
        option.setAttribute("aria-selected", index === selectedIndex);
    });
    const listBox = getListBox(shadowRootEl);
    const selectedOption = options[selectedIndex];
    const id = selectedOption.getAttribute("id");
    listBox.setAttribute("aria-activedescendant", id);
};

const focusOption = ({ customSelectEl, index, updateAria = false }) => {
    const { shadowRoot: shadowRootEl } = customSelectEl;
    const options = getOptions(shadowRootEl);
    const selectedOption = options[index];
    if (selectedOption) {
        selectedOption.focus();
        if (updateAria) {
            updateOptionAria({ customSelectEl, selectedIndex: index });
        }
    }
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
        e.key === LEFT_ARROW_KEY_CODE ||
        e.key === HOME_KEY_CODE ||
        e.key === END_KEY_CODE ||
        e.key === PAGE_UP_KEY_CODE ||
        e.key === PAGE_DOWN_KEY_CODE;
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
        updateOptionsListVisibility({
            customSelectEl,
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
    selectButton.setAttribute("title", value);
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
    updateOptionsListVisibility({
        customSelectEl,
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
        focusOption({ customSelectEl, index: newIndex, updateAria: true });
        const selectedOption = getSelectedCustomOption({
            customSelectEl,
            selectedIndex: newIndex,
        });
        updateCustomOptionSelected({
            customSelectEl,
            selectedIndex: newIndex,
        });
        const { value: selectedValue } = selectedOption;
        customSelectEl.value = selectedValue;
        customSelectEl.selectedIndex = newIndex;
        updateSelectValue({
            shadowRootEl: customSelectEl.shadowRoot,
            value: selectedValue,
        });
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
        case HOME_KEY_CODE:
        case END_KEY_CODE:
        case PAGE_UP_KEY_CODE:
        case PAGE_DOWN_KEY_CODE:
            focusNextOption({
                index,
                length,
                code: e.key,
                customSelectEl,
            });
            break;

        case ESCAPE_KEY_CODE:
        case TAB_KEY_CODE:
            updateOptionsListVisibility({
                customSelectEl,
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
    const {
        listBoxId = 0,
        required = false,
        disabled = false,
        ariaInvalid = false,
        isDevice,
    } = customSelectEl;
    const selectButton = document.createElement("button");
    if (!isDevice) {
        selectButton.setAttribute("role", "combobox");
        setAttrAndUpdateProp({
            customSelectEl,
            target: selectButton,
            name: "aria-controls",
            value: `listbox-${listBoxId}`,
        });
        setAttrAndUpdateProp({
            customSelectEl,
            target: selectButton,
            name: "aria-owns",
            value: `listbox-${listBoxId}`,
        });
    }
    setAttrAndUpdateProp({
        customSelectEl,
        target: selectButton,
        name: "aria-haspopup",
        value: isDevice ? "menu" : "listbox",
    });
    setAttrAndUpdateProp({
        customSelectEl,
        target: selectButton,
        name: "aria-expanded",
        value: "false",
    });
    selectButton.setAttribute("aria-required", required);
    selectButton.setAttribute("aria-disabled", disabled);
    if (disabled) selectButton.setAttribute("disabled", "");
    selectButton.setAttribute("aria-invalid", ariaInvalid);

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
            focusOption({
                customSelectEl,
                index: originalIndex,
                updateAria: true,
            });
            const selectedOption = getSelectedCustomOption({
                customSelectEl,
                selectedIndex: originalIndex,
            });
            updateCustomOptionSelected({
                customSelectEl,
                selectedIndex: originalIndex,
            });
            const { value: selectedValue } = selectedOption;
            customSelectEl.value = selectedValue;
            customSelectEl.selectedIndex = originalIndex;
            updateSelectValue({
                shadowRootEl,
                value: selectedValue,
            });
        } else if (originalIndex !== selectedIndex) {
            customSelectEl.selectedIndex = originalIndex;
            updateCustomOptionSelected({
                customSelectEl,
                selectedIndex: originalIndex,
            });
            customSelectEl.value = customOptions[originalIndex].value;
            updateSelectValue({ shadowRootEl, value: customSelectEl.value });
        }
    }
};

const createListContainer = (customSelectEl, options = []) => {
    const { listBoxId = 0 } = customSelectEl;
    const listContainer = document.createElement("div");
    listContainer.setAttribute("class", "custom-select-list-container");
    listContainer.style.visibility = "hidden";

    const listBox = document.createElement("div");
    listBox.setAttribute("role", "listbox");
    listBox.setAttribute("id", `listbox-${listBoxId}`);
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
            height: auto;
            max-height: 15rem;
            margin: 0;

            border-radius: 0px;
            border: 1px solid black;
            background: white;
            overflow-y: auto;
        }

        .custom-select-list-box {
            display: flex;
            flex-direction: column;
            height: fit-content;
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
    const { shadowRoot: shadowRootEl, listBoxId } = customSelectEl;
    const selectContainer = document.createElement("div");
    selectContainer.setAttribute("class", "custom-select-container");

    const selectButton = createSelectButton(customSelectEl);
    const listContainer = createListContainer(customSelectEl);

    selectContainer.append(selectButton, listContainer);

    // Create basic CSS to apply to the shadow dom
    const style = document.createElement("style");
    style.textContent = getBasicStyles();

    const templateId = customSelectEl.getAttribute("data-template-id");
    const styleTemplate = document.getElementById(templateId || "");
    const styleTag = styleTemplate ? styleTemplate.content.cloneNode(true) : "";

    shadowRootEl.append(style, styleTag, selectContainer);

    // Need to Create list box like a dialog
    const listBox = document.createElement("custom-list-box");
    listBox.setAttribute("data-custom-list-box-id", listBoxId);
    customSelectEl.customListBoxEl = listBox;
    document.body.appendChild(listBox);
};

const updateOptionDisplay = customSelectEl => {
    if (isMobileOrTablet() || window.matchMedia("(max-width: 767px)").matches) {
        console.log("update option UI");
        customSelectEl.isDevice = true;
    } else {
        console.log("update option UI else part");
        customSelectEl.isDevice = false;
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

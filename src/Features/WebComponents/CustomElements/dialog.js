const ESCAPE_KEY_OR_CODE = "Escape";
const TAB_KEY_OR_CODE = "Tab";
const DEFAULT_FOCUSABLE_TAGS = [
    "A",
    "BUTTON",
    "INPUT",
    "TEXTAREA",
    "SELECT",
    "DETAILS",
];

const getFocusableElements = element => {
    const parentEl = element || document;
    return [
        ...parentEl.querySelectorAll(
            'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])',
        ),
    ].filter(el => isFocusable(el));
};

const focusFirstFocusableEl = element => {
    const focusableElements = getFocusableElements(element);
    if (focusableElements.length) {
        attemptFocus(focusableElements[0]);
    }
};

const focusLastFocusableEl = element => {
    const focusableElements = getFocusableElements(element);
    if (focusableElements.length) {
        const lastElIndex = focusableElements.length - 1;
        attemptFocus(focusableElements[lastElIndex]);
    }
};

const isFocusable = element => {
    if (element.tagName === "INPUT" && element.type === "hidden") return false;
    if (
        element.tabIndex > 0 ||
        (element.tabIndex === 0 && element.getAttribute("tabIndex") !== null)
    ) {
        return true;
    }
    if (element.hasAttribute("disabled")) return false;
    if (element.tagName === "A") return !!element.href;
    return DEFAULT_FOCUSABLE_TAGS.includes(element.tagName);
};

const getExactActiveEl = (El = document) => {
    const shadowDOMRoot = El.activeElement?.shadowRoot;
    if (shadowDOMRoot) {
        return getExactActiveEl(shadowDOMRoot);
    } else {
        return El.activeElement;
    }
};

const attemptFocus = element => {
    if (!isFocusable(element)) {
        return false;
    }
    try {
        element.focus();
    } catch (e) {
        console.log("ERROR: Not able to focus to element", element);
    }
    return getExactActiveEl() === element;
};

const initializeDialog = () => {
    if (typeof focusAfterClosed === "string") {
        this.focusAfterClosed = document.getElementById(focusAfterClosed);
    } else if (typeof focusAfterClosed === "object") {
        this.focusAfterClosed = focusAfterClosed;
    } else {
        this.focusAfterClosed = this.prevFocusedEl;
    }

    if (typeof focusFirst === "string") {
        this.focusFirst = document.getElementById(focusFirst);
    } else if (typeof focusFirst === "object") {
        this.focusFirst = focusFirst;
    } else {
        this.focusFirst = null;
    }

    addListeners();

    if (this.focusFirst) {
        this.focusFirst.focus();
    } else {
        focusFirstFocusableEl(this.dialogNode);
    }
};

const handleEscape = event => {
    var key = e.key || e.code;

    if (key === ESCAPE_KEY_OR_CODE) {
        event.stopPropagation();
        // close the dialog
    }
};

const addListeners = () => {
    document.addEventListener("focus", trapFocus, true);
    document.addEventListener("keyup", handleEscape);
};

const removeListeners = () => {
    document.removeEventListener("focus", trapFocus, true);
    document.removeEventListener("keyup", handleEscape);
};

const trapFocus = event => {
    // if focus came to prev node
    // move focus to last focusable element
    // focusLastFocusableEl(element)
    // if focus came to post node
    // move focus to first focusable element
    // focusLastFocusableEl(element)
};

const onDialogClose = () => {
    removeListeners();
    this.focusAfterClosed.focus();
};

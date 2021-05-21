import * as DeclarativeShadowDOM from "./Features/DeclarativeShadowDOM/index.js";
import * as BlockBreaker from "./Features/BlockBreaker/index.js";
import * as DragAndDrop from "./Features/DragAndDrop/index.js";
import * as ImportMaps from "./Features/ImportMaps/index.js";
import "./index.css";

const routes = [
    {
        route: "declarative-shadow-dom",
        component: DeclarativeShadowDOM,
    },
    {
        route: "block-breaker",
        component: BlockBreaker,
    },
    {
        route: "drag-and-drop",
        component: DragAndDrop,
    },
    {
        route: "import-maps",
        component: ImportMaps,
    },
];

const homePageTemplate = `
<h1>Features</h1>
    <ul>
        <li><a id="declarative-shadow-dom" href="#declarative-shadow-dom" >Declarative Shadow DOM</a></li>
        <li><a id="block-breaker" href="#block-breaker" >Block Breaker Game</a></li>
        <li><a id="drag-and-drop" href="#drag-and-drop" >Drag and Drop</a></li>
        <li><a id="import-maps" href="#import-maps" >Import Maps</a></li>
    </ul>
`;

const getComponent = (route) => {
    const currentRoute = routes.find((item) => item.route === route);
    const { component = null } = currentRoute || {};
    return component;
};

const initializeRoute = () => {
    console.log("initializeRoute");
    const routerOutletElement = document.querySelectorAll(
        "[data-router-elements]"
    )[0];
    const { hash = "" } = location;
    const extractedHashRoute = hash.substring(1);
    if (!extractedHashRoute) {
        routerOutletElement.innerHTML = homePageTemplate;
    } else {
        const component = getComponent(extractedHashRoute);
        if (component) {
            routerOutletElement.innerHTML = component.template;
            component.initialize();
        }
    }
};

window.addEventListener("hashchange", function () {
    initializeRoute();
    console.log("hashchange event log after merge");
});

initializeRoute();

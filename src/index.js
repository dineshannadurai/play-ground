import * as DeclarativeShadowDOM from "./Features/Upcoming/DeclarativeShadowDOM/index.js";
import * as BlockBreaker from "./Features/Javascript/BlockBreaker/index.js";
import * as DragAndDrop from "./Features/Javascript/DragAndDrop/index.js";
import * as ImportMaps from "./Features/Upcoming/ImportMaps/index.js";
import * as LearnCSS from "./Features/HtmlAndCss/LearnCSS/index.js";
import * as Upcoming from "./Features/Upcoming/index.js";
import * as Javascript from "./Features/Javascript/index.js";
import * as HtmlAndCss from "./Features/HtmlAndCss/index.js";
import "./index.css";

const routes = [
    {
        route: "declarative-shadow-dom",
        component: DeclarativeShadowDOM,
        hasChildRoutes: false,
    },
    {
        route: "block-breaker",
        component: BlockBreaker,
        hasChildRoutes: false,
    },
    {
        route: "drag-and-drop",
        component: DragAndDrop,
        hasChildRoutes: false,
    },
    {
        route: "import-maps",
        component: ImportMaps,
        hasChildRoutes: false,
    },
    {
        route: "learn-css",
        component: LearnCSS,
        hasChildRoutes: true,
    },
    {
        route: "upcoming",
        component: Upcoming,
        hasChildRoutes: true,
    },
    {
        route: "javascript",
        component: Javascript,
        hasChildRoutes: true,
    },
    {
        route: "html-and-css",
        component: HtmlAndCss,
        hasChildRoutes: true,
    },
];

const template = `
    <h1>Features</h1>
    <ul>
        <li><a id="declarative-shadow-dom" href="#declarative-shadow-dom" >Declarative Shadow DOM</a></li>
        <li><a id="block-breaker" href="#block-breaker" >Block Breaker Game</a></li>
        <li><a id="drag-and-drop" href="#drag-and-drop" >Drag and Drop</a></li>
        <li><a id="import-maps" href="#import-maps" >Import Maps</a></li>
        <li><a id="learn-css" href="#learn-css" >Learn CSS</a></li>
    </ul>
`;

const findRoutesHandler = route => item => {
    if (item.hasChildRoutes) {
        return route.includes(item.route);
    }
    return item.route === route;
};

const getComponent = route => {
    const currentRoute = routes.find(findRoutesHandler(route));
    const { component = null } = currentRoute || {};
    return component;
};

const initialize = () => {
    const routerOutletElement = document.querySelectorAll(
        "[data-router-elements]",
    )[0];
    const { hash = "" } = location;
    const extractedHashRoute = hash.substring(1);
    if (!extractedHashRoute) {
        routerOutletElement.innerHTML = template;
    } else {
        const component = getComponent(extractedHashRoute);
        if (component) {
            routerOutletElement.innerHTML = component.template;
            component.initialize();
        }
    }
};

window.addEventListener("hashchange", function () {
    console.log("hashchange event");
    initialize();
});

initialize();

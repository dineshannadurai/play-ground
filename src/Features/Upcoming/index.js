import { getBreadcrumb } from "utils";
import * as DeclarativeShadowDOM from "./DeclarativeShadowDOM/index.js";
import * as ImportMaps from "./ImportMaps/index.js";

const CURRENT_ROUTE = "upcoming";

const routes = [
    {
        route: "/declarative-shadow-dom",
        component: DeclarativeShadowDOM,
        hasChildRoutes: false,
    },
    {
        route: "/import-maps",
        component: ImportMaps,
        hasChildRoutes: false,
    },
];
const pages = [
    { link: "#", name: "Home" },
    { link: "#upcoming", name: "Upcoming" },
];

export let template = `
<div class="upcoming">
    ${getBreadcrumb(pages)}
    <h1>Upcoming</h1>
    <ul>
        <li><a id="declarative-shadow-dom" href="#${CURRENT_ROUTE}/declarative-shadow-dom" >Declarative Shadow DOM</a></li>
        <li><a id="import-maps" href="#${CURRENT_ROUTE}/import-maps" >Import Maps</a></li>
    </ul>
<div>
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

export const initialize = () => {
    document.title = "Javascript";
    const routerOutletElement = document.querySelectorAll(
        "[data-router-elements]",
    )[0];
    const { hash = "" } = location;
    const extractedHashRoute = hash.substring(1);
    const component = getComponent(extractedHashRoute.split(CURRENT_ROUTE)[1]);
    if (component) {
        routerOutletElement.innerHTML = component.template;
        component.initialize();
    }
};

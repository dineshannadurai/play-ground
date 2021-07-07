import { getBreadcrumb } from "utils";
import * as CustomElements from "./CustomElements/index.js";

const CURRENT_ROUTE = "web-components";

const routes = [
    {
        route: "/custom-elements",
        component: CustomElements,
        hasChildRoutes: false,
    },
];
const pages = [
    { link: "#", name: "Home" },
    { link: "#web-components", name: "Web Components" },
];

export let template = `
<div class="web-components">
    ${getBreadcrumb(pages)}
    <h1>Web Components</h1>
    <ul>
        <li><a id="custom-elements" href="#${CURRENT_ROUTE}/custom-elements" >Custom Elements</a></li>
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
    document.title = "Web Components";
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

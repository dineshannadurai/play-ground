import { getBreadcrumb } from "utils";
import * as LearnCSS from "./LearnCSS/index.js";
import * as Html from "./HTML/index.js";

const CURRENT_ROUTE = "html-and-css";

const routes = [
    {
        route: "learn-css",
        component: LearnCSS,
        hasChildRoutes: true,
    },
    {
        route: "html",
        component: Html,
        hasChildRoutes: true,
    },
];
const pages = [
    { link: "#", name: "Home" },
    { link: "#html-and-css", name: "HTML & CSS" },
];

export let template = `
<div class="html-and-css">
    ${getBreadcrumb(pages)}
    <h1>HTML & CSS</h1>
    <ul>
        <li><a id="learn-css" href="#${CURRENT_ROUTE}/learn-css" >Learn CSS</a></li>
        <li><a id="html" href="#${CURRENT_ROUTE}/html" >HTML Topics</a></li>
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
    document.title = "HTML & CSS";
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

import { getBreadcrumb } from "utils";
import * as BoxModel from "./BoxModel/index.js";
import * as Selectors from "./Selectors/index.js";
import * as Cascade from "./Cascade/index.js";
import * as Specificity from "./Specificity/index.js";
import "./index.css";

const CURRENT_ROUTE = "html-and-css/learn-css";

const routes = [
    {
        route: "/box-model",
        component: BoxModel,
        hasChildRoutes: false,
    },
    {
        route: "/selectors",
        component: Selectors,
        hasChildRoutes: false,
    },
    {
        route: "/cascade",
        component: Cascade,
        hasChildRoutes: false,
    },
    {
        route: "/specificity",
        component: Specificity,
        hasChildRoutes: false,
    },
];
const pages = [
    { link: "#", name: "Home" },
    { link: "#html-and-css", name: "HTML & CSS" },
    { link: "#html-and-css/learn-css", name: "Learn CSS" },
];

export let template = `
<div class="learn-css">
    ${getBreadcrumb(pages)}
    <input class="stop-animation" id="stop-heading-animation" type="checkbox" />
    <label class="stop-animation" for="stop-heading-animation">
        stop animation
    </label>
    <br />
    <h1>Learn CSS</h1>
    <ul>
        <li><a id="box-model" href="#${CURRENT_ROUTE}/box-model" >Box Model</a></li>
        <li><a id="selectors" href="#${CURRENT_ROUTE}/selectors" >Selectors</a></li>
        <li><a id="cascade" href="#${CURRENT_ROUTE}/cascade" >Cascade</a></li>
        <li><a id="specificity" href="#${CURRENT_ROUTE}/specificity" >Specificity</a></li>
    </ul>
</div>
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
    document.title = "Learn CSS";
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

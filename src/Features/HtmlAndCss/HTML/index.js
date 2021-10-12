import { getBreadcrumb } from "utils";
import * as ContentModel from "./ContentModel/index.js";
import * as ElementKinds from "./ElementKinds/index.js";

const CURRENT_ROUTE = "html-and-css/html";

const routes = [
    {
        route: "/content-model",
        component: ContentModel,
        hasChildRoutes: false,
    },
    {
        route: "/element-kinds",
        component: ElementKinds,
        hasChildRoutes: false,
    },
];
const pages = [
    { link: "#", name: "Home" },
    { link: "#html-and-css", name: "HTML & CSS" },
    { link: "#html-and-css/html", name: "HTML" },
];

export let template = `
<div class="html">
    ${getBreadcrumb(pages)}
    <h1>HTML</h1>
    <ul>
        <li><a id="content-model" href="#${CURRENT_ROUTE}/content-model" >Content Model</a></li>
        <li><a id="element-kinds" href="#${CURRENT_ROUTE}/element-kinds" >Kinds of Elements</a></li>
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
    document.title = "HTML Topics";
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

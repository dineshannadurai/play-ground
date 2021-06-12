import { getBreadcrumb } from "utils";
import * as BlockBreaker from "./BlockBreaker/index.js";
import * as DragAndDrop from "./DragAndDrop/index.js";

const CURRENT_ROUTE = "javascript";

const routes = [
    {
        route: "/block-breaker",
        component: BlockBreaker,
        hasChildRoutes: false,
    },
    {
        route: "/drag-and-drop",
        component: DragAndDrop,
        hasChildRoutes: false,
    },
];
const pages = [
    { link: "#", name: "Home" },
    { link: "#javascript", name: "Javascript" },
];

export let template = `
<div class="javascript">
    ${getBreadcrumb(pages)}
    <h1>Javascript</h1>
    <ul>
        <li><a id="block-breaker" href="#${CURRENT_ROUTE}/block-breaker" >Block Breaker Game</a></li>
        <li><a id="drag-and-drop" href="#${CURRENT_ROUTE}/drag-and-drop" >Drag and Drop</a></li>
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

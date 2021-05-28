import * as BoxModel from "./BoxModel/index.js";
import * as Selectors from "./Selectors/index.js";

const CURRENT_ROUTE = "learn-css";

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
];

export let template = `
<h1>Learn CSS</h1>
    <ul>
        <li><a id="box-model" href="#${CURRENT_ROUTE}/box-model" >Box Model</a></li>
        <li><a id="selectors" href="#${CURRENT_ROUTE}/selectors" >Selectors</a></li>
    </ul>
`;

const findRoutesHandler = (route) => (item) => {
    if (item.hasChildRoutes) {
        return route.includes(item.route);
    }
    return item.route === route;
};

const getComponent = (route) => {
    const currentRoute = routes.find(findRoutesHandler(route));
    const { component = null } = currentRoute || {};
    return component;
};

export const initialize = () => {
    document.title = "Learn CSS";
    const routerOutletElement = document.querySelectorAll(
        "[data-router-elements]"
    )[0];
    const { hash = "" } = location;
    const extractedHashRoute = hash.substring(1);
    const component = getComponent(extractedHashRoute.split(CURRENT_ROUTE)[1]);
    if (component) {
        routerOutletElement.innerHTML = component.template;
        component.initialize();
    }
};

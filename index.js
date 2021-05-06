// Simple client side hash routing

const routes = [
    {
        route: "declarative-shadow-dom",
        path: "./Features/DeclarativeShadowDOM/index.js",
    },
    {
        route: "block-breaker",
        path: "./Features/BlockBreaker/index.js",
    },
    {
        route: "drag-and-drop",
        path: "./Features/DragAndDrop/index.js",
    },
];

const homePageTemplate = `
<h1>Features</h1>
    <ul>
        <li><a id="declarative-shadow-dom" href="#declarative-shadow-dom" >Declarative Shadow DOM</a></li>
        <li><a id="block-breaker" href="#block-breaker" >Block Breaker Game</a></li>
        <li><a id="drag-and-drop" href="#drag-and-drop" >Drag and Drop</a></li>
    </ul>
`;

const getPath = (route) => {
    const currentRoute = routes.find((item) => item.route === route);
    const { path: filePath = "" } = currentRoute || {};
    return filePath;
};

const initializeRoute = () => {
    const routerOutletElement = document.querySelectorAll(
        "[data-router-elements]"
    )[0];
    const { hash = "" } = location;
    const extractedHashRoute = hash.substring(1);
    if (!extractedHashRoute) {
        routerOutletElement.innerHTML = homePageTemplate;
    } else {
        const currentPath = getPath(extractedHashRoute);
        if (currentPath) {
            import(currentPath).then((module) => {
                routerOutletElement.innerHTML = module.template;
                module.initialize();
            });
        }
    }
};

window.addEventListener("hashchange", function () {
    console.log("hashchange event");
    initializeRoute();
});

initializeRoute();

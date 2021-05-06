/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("// Simple client side hash routing\r\n\r\nconst routes = [\r\n    {\r\n        route: \"declarative-shadow-dom\",\r\n        path: \"./Features/DeclarativeShadowDOM/index.js\",\r\n    },\r\n    {\r\n        route: \"block-breaker\",\r\n        path: \"./Features/BlockBreaker/index.js\",\r\n    },\r\n    {\r\n        route: \"drag-and-drop\",\r\n        path: \"./Features/DragAndDrop/index.js\",\r\n    },\r\n];\r\n\r\nconst homePageTemplate = `\r\n<h1>Features</h1>\r\n    <ul>\r\n        <li><a id=\"declarative-shadow-dom\" href=\"#declarative-shadow-dom\" >Declarative Shadow DOM</a></li>\r\n        <li><a id=\"block-breaker\" href=\"#block-breaker\" >Block Breaker Game</a></li>\r\n        <li><a id=\"drag-and-drop\" href=\"#drag-and-drop\" >Drag and Drop</a></li>\r\n    </ul>\r\n`;\r\n\r\nconst getPath = (route) => {\r\n    const currentRoute = routes.find((item) => item.route === route);\r\n    const { path: filePath = \"\" } = currentRoute || {};\r\n    return filePath;\r\n};\r\n\r\nconst initializeRoute = () => {\r\n    const routerOutletElement = document.querySelectorAll(\r\n        \"[data-router-elements]\"\r\n    )[0];\r\n    const { hash = \"\" } = location;\r\n    const extractedHashRoute = hash.substring(1);\r\n    if (!extractedHashRoute) {\r\n        routerOutletElement.innerHTML = homePageTemplate;\r\n    } else {\r\n        const currentPath = getPath(extractedHashRoute);\r\n        if (currentPath) {\r\n            __webpack_require__(\"./ lazy recursive\")(currentPath).then((module) => {\r\n                routerOutletElement.innerHTML = module.template;\r\n                module.initialize();\r\n            });\r\n        }\r\n    }\r\n};\r\n\r\nwindow.addEventListener(\"hashchange\", function () {\r\n    console.log(\"hashchange event\");\r\n    initializeRoute();\r\n});\r\n\r\ninitializeRoute();\r\n\n\n//# sourceURL=webpack://play-ground/./index.js?");

/***/ }),

/***/ "./ lazy recursive":
/*!*********************************!*\
  !*** .// lazy namespace object ***!
  \*********************************/
/***/ ((module) => {

eval("function webpackEmptyAsyncContext(req) {\n\t// Here Promise.resolve().then() is used instead of new Promise() to prevent\n\t// uncaught exception popping up in devtools\n\treturn Promise.resolve().then(() => {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t});\n}\nwebpackEmptyAsyncContext.keys = () => ([]);\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./ lazy recursive\";\nmodule.exports = webpackEmptyAsyncContext;\n\n//# sourceURL=webpack://play-ground/.//_lazy_namespace_object?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;
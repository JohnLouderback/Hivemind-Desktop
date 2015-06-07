/// <reference path="lib.es6.d.ts"/>
var App = (function () {
    function App() {
    }
    Object.defineProperty(App, "model", {
        get: function () {
            return App.internalModelWrapper.model;
        },
        set: function (value) {
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    App.internalModelWrapper.model[key] = value[key];
                }
            }
            App.Utils.Observe.observeObjects(false, App.internalModelWrapper);
        },
        enumerable: true,
        configurable: true
    });
    App.initialize = function () {
        App.Utils.Observe.observeObjects(false, App.internalModelWrapper);
        App.Dom.initialize();
    };
    App.internalModelWrapper = { model: {} };
    App.regexForTemplate = '\\$\\{(.*?)\\}';
    App.regexForModelPaths = '((App|this)\\.(.*?)(?!\\[.*?|.*?\\])(?:\\||$|\\n|\\*|\\+|\\\\|\\-|\\s|\\(|\\)|\\|\\||&&|\\?|\\:|\\!))';
    App.elementToModelMap = new Map([['', []]]);
    App.subscribedElementsToModelMap = new Map([['', []]]);
    return App;
})();
//# sourceMappingURL=App.js.map
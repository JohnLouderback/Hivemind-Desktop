/// <reference path="lib.es6.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var App;
(function (App_1) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.isElement = function (o) {
            return (typeof HTMLElement === "object" ? o instanceof HTMLElement :
                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string");
        };
        Utils.processTemplateThroughPipes = function (value) {
            var value = value.split(/(?!\[.*?|.*?\])\|/g);
            var returnVal = eval(value[0].trim());
            if (typeof returnVal !== 'undefined') {
                returnVal = String(returnVal).trim();
                if (value.length <= 1) {
                    return returnVal;
                }
                else {
                    for (var i = 1; i < value.length; i++) {
                        var func = value[i].trim();
                        var args = App.Utils.splitParametersBySpaces(func);
                        for (var n = 1; n < args.length; n++) {
                            args[n] = App.Utils.unwrapQuotes(App.Utils.castStringToType(args[n]));
                        }
                        func = args.shift();
                        if (typeof App.Pipes[func] !== 'undefined') {
                            args.unshift(returnVal);
                            returnVal = App.Pipes[func](returnVal, args);
                        }
                        else if (typeof String(returnVal)[func] !== 'undefined') {
                            returnVal = window['String']['prototype'][func].apply(returnVal, args);
                        }
                    }
                    if (typeof returnVal === 'undefined' || String(returnVal).toLowerCase() === 'nan' || String(returnVal).toLowerCase() === 'undefined') {
                        return "";
                    }
                    else {
                        return returnVal;
                    }
                }
            }
            else {
                return '';
            }
        };
        Utils.splitParametersBySpaces = function (string) {
            var string = string;
            var arr = [];
            var inQuoteDouble = false;
            var inQuoteSingle = false;
            var lastSpace = -1;
            var lastChar = "";
            var numberOfSpaces = 0;
            var charArr = string.trim().split('');
            for (var i = 0; i < charArr.length; i++) {
                var currChar = charArr[i];
                if (currChar !== " " || currChar !== lastChar) {
                    if (currChar === " " && !inQuoteDouble && !inQuoteSingle) {
                        arr.push(string.substr(lastSpace + 1, i - lastSpace - 1).trim());
                        lastSpace = i;
                    }
                    else if (currChar === "\"" && lastChar !== "\\" && !inQuoteSingle) {
                        if (inQuoteDouble) {
                            inQuoteDouble = false;
                        }
                        else {
                            inQuoteDouble = true;
                        }
                    }
                    else if (currChar === "'" && lastChar !== "\\" && !inQuoteDouble) {
                        if (inQuoteSingle) {
                            inQuoteSingle = false;
                        }
                        else {
                            inQuoteSingle = true;
                        }
                    }
                }
                lastChar = currChar;
            }
            arr.push(string.substr(lastSpace + 1, (string.length - 1) - lastSpace).trim());
            return arr;
        };
        Utils.castStringToType = function (string) {
            if (string.trim().toLowerCase() === 'true') {
                return true;
            }
            else if (string.trim().toLowerCase() === 'false') {
                return false;
            }
            else {
                return string;
            }
        };
        Utils.unwrapQuotes = function (string) {
            var string = string.trim();
            var firstChar = string.substr(0, 1);
            var lastChar = string.substr(string.length - 1);
            if (firstChar === "\"" && lastChar === "\"") {
                string = string.substr(1, string.length - 2).replace(/\\"/g, "\"");
            }
            else if (firstChar === "'" && lastChar === "'") {
                string = string.substr(1, string.length - 2).replace(/\\'/g, "'");
            }
            return string;
        };
        return Utils;
    })();
    App_1.Utils = Utils;
    var Utils;
    (function (Utils) {
        var Observe = (function () {
            function Observe() {
            }
            Observe.observeObjects = function (unobserve, objectToObserve, objectLocationString, previousObjects) {
                var observationAction = unobserve ? 'unobserve' : 'observe';
                var witnessedObjects = App.Utils.Observe.witnessedObjects;
                var observerFunctions = App.Utils.Observe.observerFunctions;
                var observeObjects = App.Utils.Observe.observeObjects;
                previousObjects = previousObjects || [];
                for (var key in objectToObserve) {
                    if (objectToObserve.hasOwnProperty(key) || Array.isArray(objectToObserve)) {
                        var value = objectToObserve[key];
                        if ((value !== null &&
                            (typeof value === 'object' || Array.isArray(value))) &&
                            !App.Utils.isElement(value) &&
                            (function () {
                                var wasNotSeen = true;
                                previousObjects.forEach(function (object) {
                                    if (object === value)
                                        wasNotSeen = false;
                                });
                                return wasNotSeen;
                            })()) {
                            previousObjects.push(value);
                            var thisLocation = "";
                            if (typeof objectLocationString === "undefined")
                                thisLocation = "" + key;
                            else {
                                if (!isNaN(key)) {
                                    thisLocation = objectLocationString + "[" + key + "]";
                                }
                                else {
                                    thisLocation = objectLocationString + "." + key;
                                }
                            }
                            witnessedObjects[thisLocation] = value;
                            var changeHandlerFunction = observerFunctions[thisLocation] ? observerFunctions[thisLocation] : function (changes) {
                                changes.forEach(function (change) {
                                    var key = !isNaN(change.name) ? '[' + change.name + ']' : '.' + change.name;
                                    var modelPath = thisLocation + key;
                                    var newValue = change.object[change.name];
                                    var oldValue = change.oldValue;
                                    if (typeof newValue === 'object' || Array.isArray(newValue)) {
                                        observeObjects(unobserve, value, thisLocation, previousObjects);
                                    }
                                    App.Utils.Observe.setElementsToValue(App.elementToModelMap, modelPath, newValue);
                                    App.Utils.Observe.updateSubscribedElements(App.subscribedElementsToModelMap, modelPath);
                                    if (Array.isArray(newValue))
                                        var logValue = JSON.stringify(newValue);
                                    else
                                        logValue = "'" + newValue + "'";
                                });
                            };
                            if (!observerFunctions[thisLocation])
                                observerFunctions[thisLocation] = changeHandlerFunction;
                            Object[observationAction](value, changeHandlerFunction);
                            observeObjects(unobserve, value, thisLocation, previousObjects);
                        }
                    }
                }
            };
            Observe.setElementsToValue = function (elementsObject, modelLocation, value) {
                var boundElements = document.querySelectorAll('input[data-bind-to="App.' + modelLocation + '"]:not([data-bind-on]), input[data-bind-to="App.' + modelLocation + '"][data-bind-on=input]');
                for (var i = 0; i < boundElements.length; i++) {
                    App.Dom.twoWayBinderInHandler(boundElements[i], value);
                }
                elementsObject.forEach(function (value, key) {
                    if (key.startsWith(modelLocation)) {
                        value.forEach(function (node) {
                            if (node instanceof Node || node instanceof HTMLElement) {
                                App.Dom.templateRenderForTextNode(node, '__template');
                            }
                            else {
                                App.Dom.templateRenderForAttribute(node.element, node.attribute, true);
                            }
                        });
                    }
                });
            };
            Observe.updateSubscribedElements = function (elementsObject, modelLocation) {
                elementsObject.forEach(function (value, key) {
                    if (key.startsWith(modelLocation)) {
                        value.forEach(function (item) {
                            item.attributes.forEach(function (attribute) {
                                attribute.callbacks.forEach(function (callback) {
                                    callback(App.Utils.processTemplateThroughPipes(attribute.expression));
                                });
                            });
                        });
                    }
                });
            };
            Observe.observerFunctions = {};
            Observe.witnessedObjects = {};
            return Observe;
        })();
        Utils.Observe = Observe;
        var Sandbox = (function () {
            function Sandbox() {
            }
            Sandbox.evaluate = function (code) {
                var workerStr = "\n\t\t\tonmessage = function (oEvent) {\n\t\t\t\tpostMessage({\n\t\t\t\t\t\"id\": oEvent.data.id,\n\t\t\t\t\t\"evaluated\": eval(oEvent.data.code)\n\t\t\t\t});\n\t\t\t}\n\t\t\t";
                var blob = new Blob([workerStr], { type: 'application/javascript' });
                var aListeners = [], oParser = new Worker(URL.createObjectURL(blob));
                oParser.onmessage = function (oEvent) {
                    debugger;
                    if (aListeners[oEvent.data.id]) {
                        aListeners[oEvent.data.id](oEvent.data.evaluated);
                    }
                    delete aListeners[oEvent.data.id];
                };
                return (function (code, fListener) {
                    aListeners.push(fListener || null);
                    oParser.postMessage({
                        "id": aListeners.length - 1,
                        "code": code
                    });
                })(code, function (data) { console.log(data); });
            };
            return Sandbox;
        })();
        Utils.Sandbox = Sandbox;
    })(Utils = App_1.Utils || (App_1.Utils = {}));
    var Dom = (function () {
        function Dom() {
        }
        Dom.initialize = function () {
            var doc = document.querySelectorAll('*');
            for (var i = 0; i < doc.length; i++) {
                App.Dom.textNodeSearch(doc[i]);
                for (var n = 0; n < doc[i].attributes.length; n++) {
                    App.Dom.templateRenderForAttribute(doc[i], doc[i].attributes[n].name);
                }
            }
            var observer = new MutationSummary({
                callback: function (summaries) {
                    App.Dom.templateFinder(summaries);
                },
                queries: [{
                        all: true
                    }]
            });
            document.querySelector('body').addEventListener('input', function (event) {
                App.Dom.twoWayBinderOutHandler(event, 'input[data-bind-to]:not([data-bind-on]), input[data-bind-to][data-bind-on=input]');
            });
            document.querySelector('body').addEventListener('change', function (event) {
                App.Dom.twoWayBinderOutHandler(event, '[data-bind-to][data-bind-on=change]');
            });
        };
        Dom.templateFinder = function (summaries) {
            summaries[0].added.forEach(function (el) {
                App.Dom.textNodeSearch(el);
            });
            summaries[0].characterDataChanged.forEach(function (el) {
                App.Dom.textNodeSearch(el);
            });
            for (var key in summaries[0].attributeChanged) {
                var attributes = summaries[0].attributeChanged;
                if (attributes.hasOwnProperty(key)) {
                    attributes[key].forEach(function (el) {
                        App.Dom.templateRenderForAttribute(el, key);
                    });
                }
            }
        };
        Dom.textNodeSearch = function (el) {
            if (el.nodeType === 3) {
                App.Dom.templateRenderForTextNode(el, 'nodeValue');
            }
            else {
                for (var i = 0; i < el.childNodes.length; i++) {
                    if (el.childNodes[i].nodeType === 3) {
                        App.Dom.templateRenderForTextNode(el.childNodes[i], 'nodeValue');
                    }
                }
            }
        };
        Dom.templateRenderForTextNode = function (el, templateProperty) {
            var regexForTemplate = new RegExp(App.regexForTemplate, 'g');
            var regexForModelPaths = new RegExp(App.regexForModelPaths, 'g');
            var matches = el[templateProperty].match(regexForTemplate);
            if (matches) {
                el['__template'] = el[templateProperty];
                el.nodeValue = el[templateProperty].replace(regexForTemplate, function (match, submatch) {
                    var modelPaths;
                    while ((modelPaths = regexForModelPaths.exec(submatch)) !== null) {
                        var modelPath = modelPaths[3].trim();
                        if (typeof App.elementToModelMap.get(modelPath) === 'undefined') {
                            App.elementToModelMap.set(modelPath, []);
                        }
                        if ((function () {
                            var notAlreadyInModel = true;
                            App.elementToModelMap.get(modelPath).forEach(function (node) {
                                if (el === node) {
                                    notAlreadyInModel = false;
                                }
                            });
                            return notAlreadyInModel;
                        }())) {
                            App.elementToModelMap.get(modelPath).push(el);
                        }
                    }
                    return App.Utils.processTemplateThroughPipes(submatch);
                });
            }
        };
        Dom.templateRenderForAttribute = function (el, attribute, useAttributeTemplate) {
            useAttributeTemplate = useAttributeTemplate || false;
            var regexForTemplate = new RegExp(App.regexForTemplate, 'g');
            var regexForModelPaths = new RegExp(App.regexForModelPaths, 'g');
            var attributeValue;
            if (useAttributeTemplate) {
                attributeValue = el['__' + attribute + 'Template'];
            }
            else {
                attributeValue = el.getAttribute(attribute);
            }
            var matches = attributeValue.match(regexForTemplate);
            if (matches) {
                el['__' + attribute + 'Template'] = attributeValue;
                el.setAttribute(attribute, attributeValue.replace(regexForTemplate, function (match, submatch) {
                    var modelPaths;
                    while ((modelPaths = regexForModelPaths.exec(submatch)) !== null) {
                        var modelPath = modelPaths[3].trim();
                        if (typeof App.elementToModelMap.get(modelPath) === 'undefined') {
                            App.elementToModelMap.set(modelPath, []);
                        }
                        if ((function () {
                            var notAlreadyInModel = true;
                            App.elementToModelMap.get(modelPath).forEach(function (item) {
                                if (typeof item.nodeValue === 'undefined' && el === item.element && attribute === item.attribute) {
                                    notAlreadyInModel = false;
                                }
                            });
                            return notAlreadyInModel;
                        }())) {
                            var SubscribedAttrTemplate = {
                                element: el,
                                attribute: attribute
                            };
                            App.elementToModelMap.get(modelPath).push(SubscribedAttrTemplate);
                        }
                    }
                    return App.Utils.processTemplateThroughPipes(submatch);
                }));
            }
        };
        Dom.twoWayBinderOutHandler = function (event, selector) {
            var targetEl = event.target;
            if (targetEl.matches(selector)) {
                var modelPath = targetEl.getAttribute('data-bind-to');
                var value = targetEl.value;
                if (value.length === 0) {
                    value = '""';
                }
                else if (isNaN(value)) {
                    value = '"' + value.replace(/("|\\)/g, '\\$&') + '"';
                }
                eval(modelPath + ' = ' + value);
            }
        };
        Dom.twoWayBinderInHandler = function (el, value) {
            el.value = value;
        };
        return Dom;
    })();
    App_1.Dom = Dom;
    var Pipes = (function () {
        function Pipes() {
        }
        Pipes.toUpperCase = function (string) {
            return string.toUpperCase();
        };
        return Pipes;
    })();
    App_1.Pipes = Pipes;
    var Element = (function () {
        function Element(el) {
            this.subscribedAttrs = [];
            if (!App[this.getClassName()].registered) {
                this.register();
            }
            if (!el) {
                this.el = new App[this.getClassName()].el;
            }
            else {
                this.el = el;
            }
            this.el['__controller'] = this;
        }
        Element.prototype.subscribeAttrToModelPath = function (attribute, callback) {
            var index = 0;
            var el = this.el;
            var regexForModelPaths = new RegExp(App.regexForModelPaths, 'g');
            var expression = el.getAttribute(attribute);
            var subscribedAttribute = {
                attribute: attribute,
                subscribedModelPaths: []
            };
            var modelPaths;
            while ((modelPaths = regexForModelPaths.exec(expression)) !== null) {
                var modelPath = modelPaths[3].trim();
                subscribedAttribute.subscribedModelPaths.push(modelPath);
                if (typeof App.subscribedElementsToModelMap.get(modelPath) === 'undefined') {
                    App.subscribedElementsToModelMap.set(modelPath, []);
                }
                if (!App.subscribedElementsToModelMap.get(modelPath).some(function (value) {
                    if (value.element === el) {
                        if (!value.attributes.some(function (attr) {
                            if (attr.attribute === attribute) {
                                attr.callbacks.push(callback);
                                return true;
                            }
                        })) {
                            value.attributes.push({
                                attribute: attribute,
                                expression: expression,
                                callbacks: [callback]
                            });
                        }
                        return true;
                    }
                })) {
                    var subscribedElement = {
                        element: el,
                        attributes: [{
                                attribute: attribute,
                                expression: expression,
                                callbacks: [callback]
                            }]
                    };
                    App.subscribedElementsToModelMap.get(modelPath).push(subscribedElement);
                }
            }
            this.subscribedAttrs.push(subscribedAttribute);
            App.Utils.Observe.updateSubscribedElements(App.subscribedElementsToModelMap, modelPath);
        };
        Element.prototype.getClassName = function () {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(this["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        };
        Element.prototype.register = function () {
            if (!App[this.getClassName()].registered) {
                App[this.getClassName()].registered = true;
                var guiElement = this;
                var document = window.document;
                App[this.getClassName()].el = document.registerElement('app-' + this.getClassName().toLowerCase(), {
                    prototype: Object.create(HTMLElement.prototype, {
                        createdCallback: {
                            value: function () {
                                if (typeof this['__controller'] === 'undefined' || !this['__controller']) {
                                    this['__controller'] = new App[guiElement.getClassName()](this);
                                }
                                var shadow = this.createShadowRoot();
                                var observer = new MutationSummary({
                                    callback: function (summaries) {
                                        App.Dom.templateFinder(summaries);
                                    },
                                    queries: [{
                                            all: true
                                        }],
                                    rootNode: shadow
                                });
                                shadow.innerHTML = "<content></content>";
                            }
                        },
                        attributeChangedCallback: function () {
                        }
                    })
                });
            }
        };
        Element.registered = false;
        return Element;
    })();
    App_1.Element = Element;
    var Print = (function (_super) {
        __extends(Print, _super);
        function Print(e) {
            _super.call(this, e);
            var element = this.el;
            this.subscribeAttrToModelPath('value', function (value) {
                element.innerHTML = value;
            });
        }
        return Print;
    })(Element);
    App_1.Print = Print;
    var If = (function (_super) {
        __extends(If, _super);
        function If(e) {
            _super.call(this, e);
            var element = this.el;
            this.subscribeAttrToModelPath('condition', function (value) {
                var val = App.Utils.castStringToType(value);
                if (val) {
                    element.setAttribute('evaluates-to', 'true');
                    element.style.display = 'block';
                }
                else {
                    element.setAttribute('evaluates-to', 'false');
                    element.style.display = 'none';
                }
                var nextSibling = element.nextElementSibling;
                var nextTagName = nextSibling.tagName;
                if (typeof nextSibling !== 'undefined' && typeof nextTagName !== 'undefined' && nextTagName.toLowerCase() === 'app-else' && typeof nextSibling['__controller'] !== 'undefined') {
                    nextSibling['__controller'].update(App.Utils.castStringToType(element.getAttribute('evaluates-to')));
                }
            });
        }
        return If;
    })(Element);
    App_1.If = If;
    var Else = (function (_super) {
        __extends(Else, _super);
        function Else(e) {
            _super.call(this, e);
        }
        Else.prototype.update = function (ifVal) {
            var element = this.el;
            if (!ifVal) {
                element.style.display = 'block';
            }
            else {
                element.style.display = 'none';
            }
        };
        return Else;
    })(Element);
    App_1.Else = Else;
})(App || (App = {}));
for (var guiClass in App) {
    if (App.hasOwnProperty(guiClass)) {
        if (typeof App[guiClass].prototype !== "undefined" && typeof App[guiClass].prototype.register !== "undefined" && typeof App[guiClass].registered !== "undefined" && !App[guiClass].registered) {
            App[guiClass].prototype.register();
        }
    }
}
App.initialize();
window['App'] = App;
//# sourceMappingURL=tectonic.js.map
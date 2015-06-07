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
exports.Utils = Utils;
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
})(Utils = exports.Utils || (exports.Utils = {}));
//# sourceMappingURL=Utils.js.map
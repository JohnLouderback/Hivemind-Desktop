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
exports.Element = Element;
//# sourceMappingURL=Element.js.map
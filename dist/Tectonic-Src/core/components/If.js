var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
})(App.Element);
exports.If = If;
//# sourceMappingURL=If.js.map
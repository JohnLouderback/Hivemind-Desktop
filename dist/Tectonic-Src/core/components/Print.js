var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
})(App.Element);
exports.Print = Print;
//# sourceMappingURL=Print.js.map
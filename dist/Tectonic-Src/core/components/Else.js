var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
})(App.Element);
exports.Else = Else;
//# sourceMappingURL=Else.js.map
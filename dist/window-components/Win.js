/// <reference path="../Tint.d.ts"/>
require('Common');
var CaptionButton = require('./windows/CaptionButton.js');
var $ = process.bridge.dotnet;
var Win = (function () {
    function Win(options) {
        var _this = this;
        this.maximizeHandler = function () {
            _this.closeButton.container.top = 5;
            _this.closeButton.container.right = 10;
        };
        this.restoreHandler = function () {
            _this.closeButton.container.top = 1;
            _this.closeButton.container.right = 5;
        };
        this.tintWindow = new Window();
        this.applyWindowChromeWindows();
        this.tintWindow.backgroundColor = '#222426';
        this.tintWindow.visible = true;
        this.tintWindow.addEventListener('maximize', this.maximizeHandler);
        this.tintWindow.addEventListener('restore', this.restoreHandler);
    }
    Win.prototype.applyWindowChromeWindows = function () {
        var win = this.tintWindow;
        var winChrome = new $.System.Windows.Shell.WindowChrome;
        var winChromeGlassFrameThickness = new $.System.Windows.Thickness;
        winChromeGlassFrameThickness.left = winChromeGlassFrameThickness.right = winChromeGlassFrameThickness.top = 0;
        winChromeGlassFrameThickness.bottom = 1;
        var winChromeResizeBorderThickness = new $.System.Windows.Thickness;
        winChromeResizeBorderThickness.left = winChromeResizeBorderThickness.right = winChromeResizeBorderThickness.top = winChromeResizeBorderThickness.bottom = 5;
        var winChromeCornerRad = new $.System.Windows.CornerRadius;
        winChromeCornerRad.TopLeft = winChromeCornerRad.TopRight = winChromeCornerRad.BottomLeft = winChromeCornerRad.BottomRight = 2;
        winChrome.CaptionHeight = 25;
        winChrome.GlassFrameThickness = winChromeGlassFrameThickness;
        winChrome.CornerRadius = winChromeCornerRad;
        $.System.Windows.Shell.WindowChrome.SetWindowChrome(win.native, winChrome);
        var closeButton = new CaptionButton({
            onClick: function () {
                win.destroy();
            }
        });
        var closeButtonCont = closeButton.container;
        closeButtonCont.top = 1;
        closeButtonCont.right = 5;
        win.appendChild(closeButtonCont);
        this.closeButton = closeButton;
        $.System.Windows.Shell.WindowChrome.SetIsHitTestVisibleInChrome(closeButtonCont.nativeView, true);
    };
    return Win;
})();
exports.Win = Win;
module.exports = Win;
//# sourceMappingURL=Win.js.map
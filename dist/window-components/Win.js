/// <reference path="../Tint.d.ts"/>
require('Common');
var merge = require('merge');
var App = global.App;
var Platforms = global.Platforms;
var platform = App.model.runtime.platform;
var platformIsWin = (platform === Platforms.WIN);
var platformIsOsx = (platform === Platforms.OSX);
if (platformIsWin) {
    var CaptionButton = require('./windows/CaptionButton.js');
}
var $ = platformIsWin ? process.bridge.dotnet : process.bridge.objc;
var Win = (function () {
    function Win(options) {
        var _this = this;
        this.maximizeHandler = function () {
            if (platformIsWin) {
                _this.closeButton.container.top = 5;
                _this.closeButton.container.right = 10;
            }
        };
        this.restoreHandler = function () {
            if (platformIsWin) {
                _this.closeButton.container.top = 1;
                _this.closeButton.container.right = 5;
            }
        };
        options = options || {};
        var defaultOpts = {
            title: App.model.resourceStrings.appName,
            width: 500,
            height: 500
        };
        merge(options, defaultOpts);
        this.tintWindow = new Window();
        if (platformIsWin) {
            this.applyWindowChromeWindows();
        }
        else if (platformIsOsx) {
            this.applyWindowChromeOsx();
        }
        this.title = options.title;
        this.tintWindow.backgroundColor = App.model.theme.window.backgroundColor;
        this.tintWindow.visible = true;
        this.tintWindow.addEventListener('maximize', this.maximizeHandler);
        this.tintWindow.addEventListener('restore', this.restoreHandler);
    }
    Object.defineProperty(Win.prototype, "title", {
        get: function () {
            return this.tintWindow.title;
        },
        set: function (value) {
            this.tintWindow.title = value;
            if (platformIsWin) {
                this.titleText.value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Win.prototype.applyWindowChromeOsx = function () {
        var win = this.tintWindow;
        win.appearance = App.model.theme.window.appearance;
        win.extendIntoTitle = true;
        win.titleTransparent = true;
    };
    Win.prototype.applyWindowChromeWindows = function () {
        var win = this.tintWindow;
        var titleFont = new Font('Helvetica', 14);
        titleFont.size = 14;
        var titleText = this.titleText = new TextInput();
        titleText.readonly = true;
        titleText.textcolor = App.model.theme.window.titleTextColor;
        titleText.value = '';
        titleText.top = titleText.left = titleText.right = 0;
        titleText.alignment = 'center';
        titleText.font = titleFont;
        win.appendChild(titleText);
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
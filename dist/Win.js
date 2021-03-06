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
                _this.closeButton.container.right = 9;
                _this.titleText.top = 9;
            }
        };
        this.restoreHandler = function () {
            if (platformIsWin) {
                _this.closeButton.container.top = 1;
                _this.closeButton.container.right = 5;
                _this.titleText.top = 3;
            }
        };
        options = options || {};
        var defaultOpts = {
            title: App.model.resourceStrings.appName,
            width: 500,
            height: 500
        };
        options = merge(defaultOpts, options);
        this.tintWindow = new Window();
        if (platformIsWin) {
            this.applyWindowChromeWindows();
        }
        else if (platformIsOsx) {
            this.applyWindowChromeOsx();
        }
        this.title = options.title;
        this.tintWindow.backgroundColor = App.model.theme.window.backgroundColor;
        this.tintWindow.width = options.width;
        this.tintWindow.height = options.height;
        this.center();
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
    Win.prototype.center = function () {
        var win = this.tintWindow;
        var winWidth = win.width;
        var winHeight = win.height;
        var screen = Screens.active;
        var screenWidth = screen.visibleBounds.width;
        var screenHeight = screen.visibleBounds.height;
        win.x = (screenWidth / 2) - (winWidth / 2);
        win.y = (screenHeight / 2) - (winHeight / 2);
    };
    Win.prototype.applyWindowChromeOsx = function () {
        var win = this.tintWindow;
        win.canBeFullscreen = true;
        if (App.model.runtime.osx.isYosemiteOrGreater) {
            win.appearance = App.model.theme.window.appearance;
            win.extendIntoTitle = true;
            win.titleTransparent = true;
        }
        else {
            win.textured = false;
        }
    };
    Win.prototype.applyWindowChromeWindows = function () {
        var win = this.tintWindow;
        var titleFont = new Font('Helvetica', 14);
        var titleText = this.titleText = new TextInput();
        titleText.readonly = true;
        titleText.textcolor = App.model.theme.window.titleTextColor;
        titleText.value = '';
        titleText.top = 3;
        titleText.left = titleText.right = 0;
        titleText.alignment = 'center';
        titleText.font = titleFont;
        win.appendChild(titleText);
        var winChrome = new $.System.Windows.Shell.WindowChrome;
        var winChromeGlassFrameThickness = new $.System.Windows.Thickness;
        winChromeGlassFrameThickness.Left = winChromeGlassFrameThickness.Right = winChromeGlassFrameThickness.Top = 0;
        winChromeGlassFrameThickness.Bottom = 1;
        var winChromeResizeBorderThickness = new $.System.Windows.Thickness;
        winChromeResizeBorderThickness.Left = winChromeResizeBorderThickness.Right = winChromeResizeBorderThickness.Top = winChromeResizeBorderThickness.Bottom = 5;
        var winChromeCornerRad = new $.System.Windows.CornerRadius;
        winChromeCornerRad.TopLeft = winChromeCornerRad.TopRight = winChromeCornerRad.BottomLeft = winChromeCornerRad.BottomRight = 2;
        winChrome.CaptionHeight = 25;
        winChrome.GlassFrameThickness = winChromeGlassFrameThickness;
        winChrome.ResizeBorderThickness = winChromeResizeBorderThickness;
        winChrome.CornerRadius = winChromeCornerRad;
        $.System.Windows.Shell.WindowChrome.SetWindowChrome(win.native, winChrome);
        var captionButtons = this.captionButtons = new Container();
        var closeButton = new CaptionButton({
            width: 50,
            image: 'app://images/close-button.png',
            imageHover: 'app://images/close-button-hover.png',
            onClick: function () {
                win.destroy();
            }
        });
        var maximizeButton = new CaptionButton({
            fadeOut: true,
            imageHover: 'app://images/maximize-button.png',
            onClick: function () {
                if (win.native.WindowState == $.System.Windows.WindowState.Normal) {
                    win.native.WindowState = $.System.Windows.WindowState.Maximized;
                }
                else {
                    win.native.WindowState = $.System.Windows.WindowState.Normal;
                }
            }
        });
        captionButtons.appendChild(maximizeButton.container);
        var minimizeButton = new CaptionButton({
            fadeOut: true,
            imageHover: 'app://images/minimize-button.png',
            onClick: function () {
                win.native.WindowState = $.System.Windows.WindowState.Minimized;
            }
        });
        captionButtons.appendChild(minimizeButton.container);
        captionButtons.top = 1;
        captionButtons.right = 3;
        win.appendChild(captionButtons);
        this.closeButton = closeButton;
        $.System.Windows.Shell.WindowChrome.SetIsHitTestVisibleInChrome(captionButtons.nativeView, true);
    };
    return Win;
})();
exports.Win = Win;
module.exports = Win;
//# sourceMappingURL=Win.js.map
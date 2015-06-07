/// <reference path="../../Tint.d.ts"/>
var merge = require('merge');
var CaptionButton = (function () {
    function CaptionButton(options) {
        var _this = this;
        this.fade = function () {
            _this.imageWellHover.alpha -= 0.33333333;
            if (_this.imageWellHover.alpha > 0) {
                setTimeout(_this.fade, 42);
            }
        };
        var defaultOpts = {
            width: 30,
            height: 20,
            image: "app://images/transparent.png",
            hoverImage: "app://images/transparent.png",
            fadeOut: false,
            onClick: function () { }
        };
        options = merge(defaultOpts, options);
        this.fadeOut = options.fadeOut;
        this.imageWell = new ImageWell();
        this.imageWell.width = options.width;
        this.imageWell.height = options.height;
        this.imageWell.top = 0;
        this.imageWell.left = 0;
        this.image = options.image;
        this.imageWellHover = new ImageWell();
        this.imageWellHover.width = options.width;
        this.imageWellHover.height = options.height;
        this.imageWellHover.alpha = 0;
        this.imageWellHover.top = 0;
        this.imageWellHover.left = 0;
        this.imageHover = options.hoverImage;
        this.container = new Container();
        this.container.width = options.width;
        this.container.height = options.height;
        this.container.appendChild(this.imageWell);
        this.container.appendChild(this.imageWellHover);
        this.container.addEventListener('mouseenter', function () {
            _this.imageWellHover.alpha = 1;
        });
        this.container.addEventListener('mouseexit', function () {
            if (_this.fadeOut) {
                _this.fade();
            }
            else {
                _this.imageWellHover.alpha = 0;
            }
        });
        this.container.addEventListener('mouseup', function () {
            options.onClick();
        });
    }
    Object.defineProperty(CaptionButton.prototype, "image", {
        get: function () {
            return this.imageWell.image;
        },
        set: function (value) {
            this.imageWell.image = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CaptionButton.prototype, "imageHover", {
        get: function () {
            return this.imageWellHover.image;
        },
        set: function (value) {
            this.imageWellHover.image = value;
        },
        enumerable: true,
        configurable: true
    });
    return CaptionButton;
})();
exports.CaptionButton = CaptionButton;
module.exports = CaptionButton;
//# sourceMappingURL=CaptionButton.js.map
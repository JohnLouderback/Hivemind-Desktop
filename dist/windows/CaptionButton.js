/// <reference path="../../Tint.d.ts"/>
var merge = require('merge');
var CaptionButton = (function () {
    function CaptionButton(options) {
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
        var thisBtn = this;
        this.container.addEventListener('mouseenter', function () {
            thisBtn.imageWellHover.alpha = 1;
        });
        this.container.addEventListener('mouseexit', function () {
            if (thisBtn.fadeOut) {
                thisBtn.fade();
            }
            else {
                thisBtn.imageWellHover.alpha = 0;
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
    CaptionButton.prototype.fade = function () {
        this.imageWellHover.alpha -= 0.05;
        if (this.imageWellHover.alpha > 0) {
            setTimeout(this.fade, 42);
        }
    };
    return CaptionButton;
})();
exports.CaptionButton = CaptionButton;
module.exports = CaptionButton;
//# sourceMappingURL=CaptionButton.js.map
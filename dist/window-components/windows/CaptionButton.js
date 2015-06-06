/// <reference path="../../Tint.d.ts"/>
var merge = require('merge');
var CaptionButton = (function () {
    function CaptionButton(options) {
        var defaultOpts = {
            width: 50,
            height: 20,
            onClick: function () { }
        };
        merge(options, defaultOpts);
        this.imageWell = new ImageWell();
        this.imageWell.width = options.width;
        this.imageWell.height = options.height;
        this.imageWell.top = 0;
        this.imageWell.left = 0;
        this.image = "app://images/close-button.png";
        this.imageWellHover = new ImageWell();
        this.imageWellHover.width = options.width;
        this.imageWellHover.height = options.height;
        this.imageWellHover.alpha = 0;
        this.imageWellHover.top = 0;
        this.imageWellHover.left = 0;
        this.imageHover = "app://images/close-button-hover.png";
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
            thisBtn.imageWellHover.alpha = 0;
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
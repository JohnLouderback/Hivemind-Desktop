/// <reference path="../../Tint.d.ts"/>
var merge: Function = require('merge');

interface CaptionButtonOptions {
	width?: number;
	height?: number;
	onClick?: Function;
}

export class CaptionButton {
	public set image(value) {
		this.imageWell.image = value;
	}
	public get image() {
		return this.imageWell.image;
	}
	public set imageHover(value) {
		this.imageWellHover.image = value;
	}
	public get imageHover() {
		return this.imageWellHover.image;
	}
	public imageWell;
	public imageWellHover;
	public container;

	constructor(options?: CaptionButtonOptions) {
		var defaultOpts: CaptionButtonOptions = {
			width: 50,
			height: 20,
			onClick: () => {}
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

		this.container.addEventListener('mouseenter', function() {
			thisBtn.imageWellHover.alpha = 1;
		});

		this.container.addEventListener('mouseexit', function() {
			thisBtn.imageWellHover.alpha = 0;
		});

		this.container.addEventListener('mouseup', function() {
			options.onClick();
		});
	}
}

module.exports = CaptionButton;
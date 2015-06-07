/// <reference path="../../Tint.d.ts"/>
var merge: Function = require('merge');

interface CaptionButtonOptions {
	width?: number;
	height?: number;
	fadeOut?: boolean;
	image: string;
	hoverImage: string;
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
	public fadeOut: boolean;

	constructor(options?: CaptionButtonOptions) {
		var defaultOpts: CaptionButtonOptions = {
			width: 30,
			height: 20,
			image: "app://images/transparent.png",
			hoverImage: "app://images/transparent.png",
			fadeOut: false,
			onClick: () => {}
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

		this.container.addEventListener('mouseenter', () => {
			this.imageWellHover.alpha = 1;
		});

		this.container.addEventListener('mouseexit', () => {
			if (this.fadeOut) {
				this.fade();
			} else {
				this.imageWellHover.alpha = 0;
			}
		});

		this.container.addEventListener('mouseup', () => {
			options.onClick();
		});
	}

	private fade = () => {
		this.imageWellHover.alpha -= 0.33333333;
		if (this.imageWellHover.alpha > 0) {
			setTimeout(this.fade, 42)
		}
	}
}

module.exports = CaptionButton;
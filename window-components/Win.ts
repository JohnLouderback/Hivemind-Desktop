/// <reference path="../Tint.d.ts"/>
declare var global;

require('Common');
var merge: Function = require('merge');
var App = global.App;
var Platforms = global.Platforms;
var platform = App.model.runtime.platform;
var platformIsWin: boolean = (platform === Platforms.WIN);
var platformIsOsx: boolean = (platform === Platforms.OSX);
if(platformIsWin) {
	var CaptionButton = require('./windows/CaptionButton.js');
}
var $ = platformIsWin ? process.bridge.dotnet : process.bridge.objc;

interface WindowOptions {
	title?: string;
	width?: number;
	height?: number;
}

export class Win {
	private tintWindow;
	private closeButton; // The close button for Windows
	private titleText; // The title text for Windows
	public get title() {
		return this.tintWindow.title;
	}
	public set title(value) {
		this.tintWindow.title = value;
		if (platformIsWin) {
			this.titleText.value = value;
		}
	}

	constructor(options?:WindowOptions) {
		options = options || {};
		var defaultOpts: WindowOptions = {
			title: App.model.resourceStrings.appName,
			width: 500,
			height: 500
		};
		options = merge( defaultOpts, options);

		this.tintWindow = new Window();

		if (platformIsWin) {
			this.applyWindowChromeWindows();
		} else if (platformIsOsx) {
			this.applyWindowChromeOsx()
		}

		this.title = options.title;

		this.tintWindow.backgroundColor = App.model.theme.window.backgroundColor;
		this.tintWindow.width = options.width;
		this.tintWindow.height = options.height;
		this.tintWindow.visible = true;
		this.tintWindow.addEventListener('maximize', this.maximizeHandler);
		this.tintWindow.addEventListener('restore', this.restoreHandler);
	}

	private maximizeHandler = () => {
		if(platformIsWin) {
			this.closeButton.container.top = 5;
			this.closeButton.container.right = 9;
			this.titleText.top = this.titleText.top + 6;
		}
	};

	private restoreHandler = () => {
		if(platformIsWin) {
			this.closeButton.container.top = 1;
			this.closeButton.container.right = 5;
			this.titleText.top = this.titleText.top - 6;
		}
	};

	private applyWindowChromeOsx() {
		var win = this.tintWindow;
		win.appearance = App.model.theme.window.appearance;
		win.extendIntoTitle = true;
		win.titleTransparent = true;
	}

	private applyWindowChromeWindows() {
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

		var closeButton = new CaptionButton({
			onClick: () => {
				win.destroy();
			}
		});
		var closeButtonCont = closeButton.container;
		closeButtonCont.top = 1;
		closeButtonCont.right = 3;
		win.appendChild(closeButtonCont);
		this.closeButton = closeButton;

		$.System.Windows.Shell.WindowChrome.SetIsHitTestVisibleInChrome(closeButtonCont.nativeView, true);
	}
}
module.exports = Win;
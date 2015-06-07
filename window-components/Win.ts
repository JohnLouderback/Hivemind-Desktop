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
	private captionButtons; // The container for caption buttons on Windows
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
		this.center();
		this.tintWindow.visible = true;
		this.tintWindow.addEventListener('maximize', this.maximizeHandler);
		this.tintWindow.addEventListener('restore', this.restoreHandler);
	}

	public center() {
		var win =  this.tintWindow;
		var winWidth = win.width;
		var winHeight = win.height;
		var screen: ActiveScreen = Screens.active;
		var screenWidth = screen.visibleBounds.width;
		var screenHeight = screen.visibleBounds.height;

		win.x = (screenWidth / 2) - (winWidth / 2);
		win.y = (screenHeight / 2) - (winHeight / 2);
	}

	private maximizeHandler = () => {
		if(platformIsWin) {
			this.captionButtons.top = 5;
			this.captionButtons.right = 9;
			this.titleText.top = 9;
		}
	};

	private restoreHandler = () => {
		if(platformIsWin) {
			this.captionButtons.top = 1;
			this.captionButtons.right = 5;
			this.titleText.top = 3;
		}
	};

	private applyWindowChromeOsx() {
		var win = this.tintWindow;
		win.canBeFullscreen = true;

		if (App.model.runtime.osx.isYosemiteOrGreater) {
			win.appearance = App.model.theme.window.appearance;
			win.extendIntoTitle = true;
			win.titleTransparent = true;
		} else {
			win.textured = false;
		}
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

		var captionButtons = this.captionButtons = new Container();

		// Close Button
		var closeButton = new CaptionButton({
			width: 50,
			image: 'app://images/close-button.png',
			hoverImage: 'app://images/close-button-hover.png',
			onClick: () => {
				win.destroy();
			}
		});
		this.closeButton = closeButton;
		closeButton.container.left = 60;
		captionButtons.appendChild(closeButton.container);

		// Maximize Button
		var maximizeButton = new CaptionButton({
			fadeOut: true,
			hoverImage: 'app://images/maximize-button.png',
			onClick: () => {
				if (win.state !== 'maximized') {
					win.state = 'maximized';
				} else {
					win.state = 'normal';
				}
			}
		});
		maximizeButton.container.left = 30;
		captionButtons.appendChild(maximizeButton.container);

		// Minimize Button
		var minimizeButton = new CaptionButton({
			fadeOut: true,
			hoverImage: 'app://images/minimize-button.png',
			onClick: () => {
					win.state = 'minimized';
			}
		});
		minimizeButton.container.left = 0;
		captionButtons.appendChild(minimizeButton.container);

		captionButtons.top = 1;
		captionButtons.right = 3;
		captionButtons.width = 110;
		win.appendChild(captionButtons);

		$.System.Windows.Shell.WindowChrome.SetIsHitTestVisibleInChrome(captionButtons.nativeView, true);
	}
}
module.exports = Win;
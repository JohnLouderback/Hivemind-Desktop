/// <reference path="../Tint.d.ts"/>
declare var global;

require('Common');
var platform = App.model.runtime.platform;
var platformIsWin: boolean = (platform === Platforms.WIN);
var platformIsOsx: boolean = (platform === Platforms.OSX);
if(platformIsWin) {
	var CaptionButton = require('./windows/CaptionButton.js');
}
var $ = platformIsWin ? process.bridge.dotnet : process.bridge.objc;



export class Win {
	public tintWindow;
	private closeButton;

	constructor(options?) {
		this.tintWindow = new Window();
		if(platformIsWin) {
			this.applyWindowChromeWindows();
		}
		this.tintWindow.backgroundColor = '#222426';
		this.tintWindow.visible = true;
		this.tintWindow.addEventListener('maximize', this.maximizeHandler);
		this.tintWindow.addEventListener('restore', this.restoreHandler);
	}

	private maximizeHandler = () => {
		if(platformIsWin) {
			this.closeButton.container.top = 5;
			this.closeButton.container.right = 10;
		}
	};

	private restoreHandler = () => {
		if(platformIsWin) {
			this.closeButton.container.top = 1;
			this.closeButton.container.right = 5;
		}
	};

	private applyWindowChromeWindows() {
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
			onClick: () => {
				win.destroy();
			}
		});
		var closeButtonCont = closeButton.container;
		closeButtonCont.top = 1;
		closeButtonCont.right = 5;
		win.appendChild(closeButtonCont);
		this.closeButton = closeButton;

		$.System.Windows.Shell.WindowChrome.SetIsHitTestVisibleInChrome(closeButtonCont.nativeView, true);
	}
}
module.exports = Win;
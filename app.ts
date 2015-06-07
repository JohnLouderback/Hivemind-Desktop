declare var require, global;
require('source-map-support').install();
require('Common');
var json = require('jsonfile');
var os = require('os');
var osVersion = parseInt(os.release().substring(0,os.release().indexOf('.')));

enum Platforms {
	WIN,
	OSX
}

interface AppModel {
	runtime?: {
		platform: Platforms;
		version: number;
		osx: {
			isOsx: boolean;
			isYosemiteOrGreater: boolean;
		}
	},
	theme?: {
		name: string;
		window: {
			appearance: string;
			backgroundColor: string;
			titleTextColor: string;
		}
	},
	resourceStrings?: Object;
}

class App {
	public static model: AppModel = {
		runtime: {
			platform: App.getPlatform(),
			version: osVersion,
			osx: {
				isOsx: (App.getPlatform() === Platforms.OSX),
				isYosemiteOrGreater: App.isYosemiteOrGreater()
			}
		},
		theme: json.readFileSync('themes/dark/theme.json'),
		resourceStrings: json.readFileSync('resources/english.json'),
	};

	public static initialize() {
		console.log('hello');
	}

	private static getPlatform() {
		if (os.platform() === 'darwin') {
			return Platforms.OSX;
		} else {
			return Platforms.WIN;
		}
	}

	private static isYosemiteOrGreater() {
		return ((App.getPlatform() === Platforms.OSX) && osVersion >= 14);
	}

}
global.App = App;
global.Platforms = Platforms;

App.initialize();
var Win = require('./window-components/Win.js');

var win = new Win({
	width: 1471,
	height: 978
});

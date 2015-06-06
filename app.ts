declare var require, global;
require('Common');
var json = require('jsonfile');
var os = require('os');

enum Platforms {
	WIN,
	OSX
}

interface AppModel {
	runtime?: {
		platform: Platforms;
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
			platform: App.getPlatform()
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

}
global.App = App;
global.Platforms = Platforms;

App.initialize();
var Win = require('./window-components/Win.js');

var win = new Win();

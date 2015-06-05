declare var require, global;
require('Common');
var os = require('os');

enum Platforms {
	WIN,
	OSX
}

interface AppModel {
	runtime: {
		platform: Platforms;
	}
}

class App {
	public static model: AppModel = {
		runtime: {
			platform: App.getPlatform()
		}
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

new Win();

require('source-map-support').install();
require('Common');
var json = require('jsonfile');
var os = require('os');
var osVersion = parseInt(os.release().substring(0, os.release().indexOf('.')));
var Platforms;
(function (Platforms) {
    Platforms[Platforms["WIN"] = 0] = "WIN";
    Platforms[Platforms["OSX"] = 1] = "OSX";
})(Platforms || (Platforms = {}));
var App = (function () {
    function App() {
    }
    App.initialize = function () {
        console.log('hello');
    };
    App.getPlatform = function () {
        if (os.platform() === 'darwin') {
            return Platforms.OSX;
        }
        else {
            return Platforms.WIN;
        }
    };
    App.isYosemiteOrGreater = function () {
        return ((App.getPlatform() === Platforms.OSX) && osVersion >= 14);
    };
    App.model = {
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
    return App;
})();
global.App = App;
global.Platforms = Platforms;
App.initialize();
var Win = require('./window-components/Win.js');
var win = new Win({
    width: 1471,
    height: 978
});
//# sourceMappingURL=app.js.map